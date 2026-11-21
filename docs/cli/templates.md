---
description: Write your own driver templates for driverforge new.
---

# Authoring templates

[`driverforge new`](/cli/new) creates a driver project from a template. The
official templates cover a plain Control4 driver; your own let a team start
every driver from the same structure, conventions and boilerplate.

## What a template is

A template is a directory in a git repository holding a driver project:

```
driver-templates/
├── thermostat/
│   ├── template.json
│   └── src/
│       ├── ${slug}.c4zproj
│       ├── driver.lua
│       └── driver.xml
└── pool-pump/
    └── ...
```

It needs a `.c4zproj` manifest and a `driver.lua` that defines
`OnDriverInit`, because that's what [`init`](/cli/init) wraps.

Leave the Driverforge SDK out. `new` embeds the latest SDK when it runs
`init`, so a copy in the template would only go stale.

A repository can hold one template per directory, picked with
`--template`, or be a single template itself, with its `template.json` at the
root.

## Placeholders

Placeholders are replaced in file contents and in file and directory names.
Every template gets these, derived from the name passed to `new`:

| Placeholder | `driverforge new My-Pool_pump` gives                   |
| ----------- | ------------------------------------------------------ |
| `${name}`   | `My-Pool_pump`, as typed                               |
| `${slug}`   | `my-pool-pump`                                         |
| `${id}`     | `my_pool_pump`, safe in Lua identifiers and file names |
| `${title}`  | `My Pool Pump`                                         |
| `${year}`   | the current year                                       |

```lua
-- ${title}, copyright ${year} Acme
${id} = {}

function OnDriverInit(strDIR)
  print("${title} starting")
end
```

Write `$${` for a literal `${`.

Placeholders use `${ }` rather than `{{ }}` because `{{` is ordinary Lua: a
table nested in a table.

A placeholder that isn't one of the built-ins or a variable the template
declares fails the run, so a typo can't slip through into the generated
project. Binary files, meaning any file containing a NUL byte, are copied
untouched.

## template.json

An optional `template.json` describes the template and declares the extra
variables it accepts:

```json
{
  "description": "Thermostat driver with a proxy binding",
  "variables": {
    "vendor": {
      "description": "Manufacturer name shown in Composer",
      "required": true
    },
    "poll_seconds": {
      "description": "How often to poll the device",
      "default": "30"
    }
  }
}
```

| Field         | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| `description` | Shown when `new` fetches the template                             |
| `variables`   | A map of variable name to `description`, `default` and `required` |

Each variable is used as `${vendor}`, `${poll_seconds}` and so on, and set
with `--set vendor=Acme`. A variable that isn't set takes its `default`. A
required variable with no default is asked for in a terminal, and without
one must be passed with `--set`. An optional variable with no default is
empty.

Variable names are letters, digits and underscores, and can't redeclare the
built-ins (`name`, `slug`, `id`, `title`, `year`).

`template.json` itself isn't copied into the project.

## Trying a template

Point `new` at your repository and branch, and skip `init` while you iterate:

```bash
driverforge new scratch --repo https://gitlab.com/acme/templates.git#my-branch \
  --template thermostat --set vendor=Acme --no-init
```

Then build the result with [`driverforge build`](/cli/build) to check the
template produces a working driver.
