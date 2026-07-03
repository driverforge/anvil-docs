---
sidebar_position: 3
---

# Automatic Capture

The Anvil SDK automatically instruments all standard Control4 event handlers. Every time Control4 calls one of these functions, you'll see it in Anvil with the exact arguments that were passed.

## How It Works

When you load the SDK, it registers wrappers for each C4 event handler:

```lua
-- Your code stays the same
function OnPropertyChanged(sProperty)
    -- Do stuff
end

-- But now every call is captured with:
-- - The sProperty value
-- - How long your code took
-- - Any errors that occurred
```

You don't need to modify your handler implementations at all.

## Captured Handlers

The SDK instruments **157 handlers** across all Control4 event categories. Here's the complete list:

### Command & Action Handlers

| Handler | When It Fires |
|---------|---------------|
| `ExecuteCommand` | Command sent to your driver |
| `ExecuteAction` | Action triggered |

### Data & Communication Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnDataFromUI` | Data received from UI |
| `OnDataToUI` | Data being sent to UI |
| `GetPrivateKeyPassword` | Private key password requested |
| `UIRequest` | UI request from navigator |
| `ReceivedAsync` | Async response received |
| `ReceivedFromProxy` | Data from a proxy binding |

### Driver Lifecycle Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnDriverInit` | Driver is initializing |
| `OnDriverLateInit` | After bindings are established |
| `OnDriverUpdate` | Driver is being updated |
| `OnDriverDestroyed` | Driver is being unloaded |
| `OnDriverAdded` | New driver added to project |
| `OnDriverDisabled` | Driver was disabled |
| `OnAlive` | Periodic health check |

### Connection & Network Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnConnectionStatusChanged` | Connection state changed |
| `OnServerConnectionStatusChanged` | Server connection changed |
| `OnNetworkBindingChanged` | Network binding changed |
| `OnConnectionAuthorized` | Connection authorized |
| `ReceivedFromNetwork` | Network data received |
| `ReceivedFromSerial` | Serial data received |
| `OnAuthorizedConnectionDisconnected` | Authorized connection lost |
| `OnNetworkBindingStatusChanged` | Network binding status changed |

### Device Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnDeviceEvent` | Device-specific event |
| `OnDeviceOnline` | Device came online |
| `OnDeviceOffline` | Device went offline |
| `OnDeviceDiscovered` | Device discovered |
| `OnDeviceIdentified` | Device identified |
| `OnDeviceIdentifying` | Device identification in progress |
| `OnDevicePreIdentify` | Before device identification |
| `OnDeviceIPAddressChanged` | Device IP changed |
| `OnDeviceFirmwareChanged` | Device firmware updated |
| `OnDeviceDataChanged` | Device data modified |
| `OnDeviceUserInitiatedRemove` | User initiated device removal |
| `OnDeviceAlreadyIdentified` | Device was already identified |
| `OnDeviceCancelIdentify` | Device identification cancelled |
| `OnDeviceIdentifiedNoLicense` | Device identified but no license |
| `OnPhysicalDeviceAdded` | Physical device added |
| `OnPhysicalDeviceRemoved` | Physical device removed |
| `OnDiscoveredDeviceAdded` | Discovered device added |
| `OnDiscoveredDeviceChanged` | Discovered device changed |
| `OnDiscoveredDeviceRemoved` | Discovered device removed |
| `OnSearchTypeFound` | Search type found |

### Event & Timer Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnEventFired` | Event fired |
| `OnTimerExpired` | Legacy timer fired |
| `OnScheduledEvent` | Scheduled event triggered |
| `OnSystemEvent` | System-wide event |
| `OnEventAdded` | Event added |
| `OnEventRemoved` | Event removed |
| `OnEventModified` | Event modified |
| `OnWatchedVariableChanged` | Watched variable changed |
| `OnAll` | Catch-all handler |

### Property & Variable Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnPropertyChanged` | Property value changed |
| `OnProjectPropertyChanged` | Project property changed |
| `OnVariableChanged` | Variable value changed |
| `OnVariableAdded` | Variable created |
| `OnVariableRemoved` | Variable deleted |
| `OnVariableRenamed` | Variable renamed |
| `OnUserVariableAdded` | User variable added |
| `OnItemDataChanged` | Item data changed |
| `OnAccessModeChanged` | Access mode changed |
| `OnTimeChanged` | System time changed |
| `OnLatitudeChanged` | Latitude changed |
| `OnLongitudeChanged` | Longitude changed |

### Binding Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnBindingChanged` | Binding connection changed |
| `OnBindingAdded` | New binding created |
| `OnBindingRemoved` | Binding removed |
| `OnBindingEntryAdded` | Binding entry added |
| `OnBindingEntryRemoved` | Binding entry removed |
| `OnBindingEntryRenamed` | Binding entry renamed |
| `OnVariableBindingAdded` | Variable binding added |
| `OnVariableBindingRemoved` | Variable binding removed |
| `OnVariableBindingRenamed` | Variable binding renamed |
| `OnVariableAddedToBinding` | Variable added to binding |
| `OnVariableRemovedFromBinding` | Variable removed from binding |
| `OnNetworkBindingAdded` | Network binding added |
| `OnNetworkBindingRemoved` | Network binding removed |

### Network Binding Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnNetworkBindingRegistered` | Network binding registered |
| `OnNetworkBindingUnregistered` | Network binding unregistered |
| `OnNetworkBindingAddressChanged` | Network binding address changed |
| `OnCIDRRulesChanged` | CIDR rules changed |
| `OnDirectorIPAddressChanged` | Director IP changed |

### Project Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnProjectLoaded` | Project loaded |
| `OnProjectLoading` | Project loading |
| `OnProjectNew` | New project created |
| `OnProjectChanged` | Project changed |
| `OnProjectLocked` | Project locked |
| `OnProjectEnterLock` | Entering project lock |
| `OnProjectLeaveLock` | Leaving project lock |
| `OnProjectClear` | Project cleared |
| `OnLocaleChanged` | Locale changed |

### Server Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnServerStatusChanged` | Server status changed |
| `OnServerDataIn` | Server data received |
| `OnSDDPDeviceStatus` | SDDP device status update |

### Media Session Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnMediaSessionAdded` | Media session added |
| `OnMediaSessionRemoved` | Media session removed |
| `OnMediaSessionChanged` | Media session changed |
| `OnMediaSessionVolumeLevelChanged` | Volume level changed |
| `OnMediaSessionVolumeSliderStateChanged` | Volume slider state changed |
| `OnMediaSessionMuteStateChanged` | Mute state changed |
| `OnMediaSessionDiscreteMuteChanged` | Discrete mute changed |
| `OnMediaSessionDiscreteVolumeChanged` | Discrete volume changed |
| `OnMediaSessionSliderTargetVolumeReached` | Slider target volume reached |

### Media Device Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnMediaDeviceAdded` | Media device added |
| `OnMediaDeviceRemoved` | Media device removed |
| `OnMediaDeviceChanged` | Media device changed |
| `OnMediaInfoAdded` | Media info added |
| `OnMediaInfoModified` | Media info modified |
| `OnMediaRemovedFromDevice` | Media removed from device |

### Media & Playlist Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnSongAddedToPlaylist` | Song added to playlist |
| `OnSongRemovedFromPlaylist` | Song removed from playlist |
| `OnMediaDataRemoved` | Media data removed |
| `OnMediaSessionMediaInfoChanged` | Session media info changed |

### Item Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnItemAdded` | Item added |
| `OnItemMoved` | Item moved |
| `OnItemNameChanged` | Item name changed |
| `OnItemRemoved` | Item removed |

### Code Item Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnCodeItemAdded` | Code item added |
| `OnCodeItemRemoved` | Code item removed |
| `OnCodeItemMoved` | Code item moved |
| `OnCodeItemEnabled` | Code item enabled |
| `OnCodeItemCommandUpdated` | Code item command updated |
| `OnCodeItemAddedToExpression` | Code item added to expression |

### Zigbee Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnZigbeeNodeOffline` | Zigbee node went offline |
| `OnZigbeeNodeOnline` | Zigbee node came online |
| `OnZigbeeNodesChanged` | Zigbee nodes changed |
| `OnZigbeeMeshChanged` | Zigbee mesh changed |
| `OnZigbeeDuplicateMesh` | Duplicate Zigbee mesh detected |
| `OnZigbeeNetworkHealth` | Zigbee network health update |
| `OnZigbeeNodeUpdateStatus` | Node update status |
| `OnZigbeeNodeUpdateSucceeded` | Node update succeeded |
| `OnZigbeeNodeUpdateFailed` | Node update failed |
| `OnZigbeeZserverChanged` | Zserver changed |
| `OnZigbeeZapsChanged` | Zaps changed |
| `OnZigBeeStickPresent` | Zigbee stick present |
| `OnZigBeeStickRemoved` | Zigbee stick removed |

### System Update & Discovery Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnSystemUpdateStarted` | System update started |
| `OnSystemUpdateFinished` | System update finished |
| `OnSystemShutDown` | System shutting down |
| `OnSDDPDeviceDiscover` | SDDP device discovered |
| `OnSysmanResponse` | Sysman response received |
| `OnReflashLockGranted` | Reflash lock granted |
| `OnReflashLockRevoked` | Reflash lock revoked |
| `OnControllerDisabled` | Controller disabled |

### Notification Handlers

| Handler | When It Fires |
|---------|---------------|
| `GetNotificationAttachmentURL` | Get notification attachment URL |
| `GetNotificationAttachmentFile` | Get notification attachment file |
| `GetNotificationAttachmentBytes` | Get notification attachment bytes |
| `FinishedWithNotificationAttachment` | Notification attachment finished |

### List Handlers

| Handler | When It Fires |
|---------|---------------|
| `ListMIBReceived` | MIB list received |
| `ListNewControl` | New control list |
| `ListEvent` | List event |
| `ListNewList` | New list created |

### Other Handlers

| Handler | When It Fires |
|---------|---------------|
| `OnZipcodeChanged` | Zipcode changed |
| `OnPIP` | PIP event |
| `OnTimezoneChanged` | Timezone changed |

## What You See

For each event, Anvil shows:

**The handler name:**
```
OnPropertyChanged
```

**The arguments Control4 passed:**
```
sProperty: "Volume"
```

**Timing:**
```
Duration: 3ms
```

**And if something broke, the full error:**
```
ERROR: attempt to index nil value
  driver.lua:142: in function <OnPropertyChanged>
```

## What's NOT Captured

Due to Lua limitations with protected userdata, these require [manual capture](/sdk/manual-capture):

- `C4:SetTimer()` callbacks
- `C4:url():OnDone()` callbacks
- Other async callbacks passed to C4 methods

The SDK can't wrap these automatically, but provides simple APIs to capture them.
