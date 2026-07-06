---
title: Agent Verification
description: The cryptographic handshake that ensures your driver's telemetry only ever reaches the genuine Anvil agent.
---

# Agent Verification

When a driver instrumented with the Anvil SDK sends telemetry, that data should reach the genuine Anvil agent on the controller — and nothing else. This page explains the mechanism that guarantees it, in enough detail that you can audit the claim rather than take our word for it.

:::info Security by default

Transparency, trust, and security by default are foundations of how Driverforge is built, baked in early rather than retrofitted when something demands them. Publishing mechanisms like this one, in full detail and with the code open to inspection, is how we'd rather earn your confidence: with a record you can verify, not assurances.

:::

## In short

- **The agent proves its identity before any telemetry is sent.** The SDK challenges the device it discovered; only the real agent can answer.
- **The proof relies on a private key that never leaves the controller.** It is generated on the device, is never transmitted, and is not present in any download.
- **Verification happens entirely offline.** The SDK makes no network call to check a proof — it verifies against a public key built into the SDK itself.
- **If verification fails, telemetry is withheld.** There is no "trust anyway" fallback. Silence is the safe answer.

## Why this exists

The SDK finds the agent by looking for a device with the agent's driver filename. On a controller where the genuine agent is installed, that's unambiguous — Control4 treats the agent as a singleton, so only one can exist. The gap is a controller where **no** agent is installed: nothing stops another driver from adopting the agent's filename and presenting itself as the agent.

Without verification, an instrumented driver would then hand that impostor its telemetry — including captured handler arguments and, on errors, local variable values. That's the exposure this mechanism closes. (Note that the ingestion API key a driver carries is _designed_ to be publishable — it is not a secret, and it is not what an impostor would be after. The telemetry stream is.)

## The two phases

Verification rests on a one-time **setup** that happens when the agent registers with Anvil, and a **challenge** that runs every time a driver discovers the agent.

![Sequence diagram of the full agent-verification lifecycle: the agent generates its keypair and registers with Anvil, the cloud issues a signed attestation, and each driver's SDK then runs the challenge-response verification before releasing telemetry](/img/anvil-agent-verification-sequence.svg)

### Setup — the agent establishes its identity (once, at registration)

1. **The agent generates a keypair on the controller.** On first run it creates an RSA private key and a self-signed certificate. The private key is stored in the controller's protected storage and never leaves it — it is not bundled in the agent download, so every controller's key is unique to that controller.

2. **The agent registers with Anvil.** After the operator signs in, the agent authenticates to the Anvil cloud and registers the controller, sending the SHA-256 **fingerprint** of its certificate. The cloud records the binding: _this controller holds the key behind this fingerprint._

3. **The cloud issues a signed attestation.** In response, Anvil returns a short-lived, signed statement — an **attestation** — that vouches for the binding: _"The controller with this identifier holds the certificate with this fingerprint."_ It is signed with Anvil's attestation key (held in a cloud key-management service) and is valid only for a bounded window and only for consumption by an Anvil SDK.

4. **The agent keeps it fresh.** The agent re-registers on every boot, so the attestation it holds is always current.

### Verification — a driver confirms the agent (every discovery)

1. **The SDK issues a challenge.** When an instrumented driver discovers the agent, the SDK generates a fresh random number (a _nonce_) and sends it to the discovered device, along with the SDK's own device identifier.

2. **The agent answers with a proof.** The genuine agent replies with three things: its stored attestation, its certificate, and a **signature** made with its private key over a message that combines the challenge nonce, the controller's hardware identifier, the agent's device identifier, and the challenging SDK's device identifier.

3. **The SDK verifies the proof — offline.** Using the Anvil attestation public key embedded in the SDK, and without contacting any server, the SDK checks, in order:
   - the attestation's signature is valid, it has not expired, and it was issued for this controller and for SDK consumption;
   - the certificate presented in the proof has the exact fingerprint the attestation vouches for;
   - the challenge signature is valid for that certificate's key, over the exact message expected.

4. **Only a complete pass releases telemetry.** If every check succeeds, the driver begins sending telemetry. If any check fails — or no valid proof arrives before a short deadline — telemetry is withheld and the driver reports the failure locally. It does not fall back to trusting the device.

## Why a fake agent can't just send the proof it wants

The proof is only three values — an attestation, a certificate, and a signature. So why can't an impostor assemble a convincing set and send them?

Walk through what an impostor would have to do:

- **Use its own certificate.** Anyone can generate a keypair and a certificate and sign the challenge with it. But the SDK also demands an _attestation_ vouching for that certificate's fingerprint — and attestations are signed by Anvil's cloud key. The impostor has no attestation for its own certificate and cannot produce one. It fails the attestation check.

- **Present the real agent's certificate instead.** A certificate is public, so an impostor can copy the genuine one, and it comes with a genuine attestation. But the challenge must be signed with _that certificate's private key_ — and that key was generated on the real controller and has never left it. The impostor can show the certificate but cannot sign with it. It fails the signature check.

- **Forge the attestation, or replay a real one.** Forging an attestation requires Anvil's signing key, which lives in a cloud key-management service and is never distributed. Replaying a whole proof captured from a genuine exchange fails too: that proof was signed over a one-time nonce the SDK will never issue again, and over the specific controller it was produced on.

The trap is structural. **The attestation says "trust the key behind this fingerprint"; the signature is the only way to prove you actually hold that key.** An impostor can satisfy either requirement on its own — its own certificate with a signature it's able to make, or the real certificate with a real attestation — but never both at once, because doing so requires the one private key that never leaves the genuine controller. There is no set of three values a fake agent can send that passes all the checks, short of possessing that key.

## What each check defends against

Beyond that core trap, each individual element of the proof closes a specific variant of attack. Removing any one of them would open a gap.

| Element of the proof                                                               | What it prevents                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Random nonce, freshly generated per challenge                                      | **Replay** — a proof captured from an earlier exchange cannot be reused, because it was signed over a nonce the SDK will never issue again.                                                              |
| Controller hardware identifier bound into the signed message _and_ the attestation | **Relay / machine-in-the-middle** — a valid proof from a genuine agent on a _different_ controller cannot be forwarded here, because it is bound to that other controller's identifier.                  |
| Certificate fingerprint must match the attestation                                 | **A forged or borrowed certificate** — an impostor can present any certificate, but only the one whose fingerprint Anvil attested will match, and producing a matching one requires Anvil's signing key. |
| Signature made with the certificate's private key                                  | **Possession, not just presentation** — proving identity requires _using_ the private key, not merely showing a public certificate that anyone could copy.                                               |
| Bounded attestation lifetime                                                       | **A stale or compromised key** — even in the worst case, an attestation is only useful for a short window before it must be reissued through a fresh, authenticated registration.                        |
| Offline verification against an embedded key                                       | **A phone-home dependency** — the SDK reveals nothing and depends on nothing at verification time; the check works on an isolated network and cannot be defeated by blocking a server.                   |
