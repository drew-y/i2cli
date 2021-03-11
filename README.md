# I2CLI

A command line interface for I2C.

# Installation

```
npm i -g i2cli
```

# Getting Started

Open the a terminal and enter the following.
```
i2cli
```

This will open an interactive prompt. The first command should always be `open`.

For a list of commands and their usage, use the `help` command. For more information
about a given command, type `help <command>`.

# Commands

## Open

```
open [bus]
```

Opens an I2C bus. This is the bus all commands will use going forward. If open isn't
run first, most other commands will fail.

Parameters:
* bus (number?) - Optional address of the I2C bus. Defaults to 1.

## Scan

```
scan
```

Lists addresses of all devices found on the open bus.

## Read

```
read <addr> [radix]
```

Read a single byte from the provided address

Parameters:
* addr (number) - Address of the device to read.
* radix (number?) - Optional base to print the result of the read. defaults to 10

## Read Buffer

```
read-buffer <addr> <length>
```

Read an arbitrary amount of bytes from the device

Parameters:
* addr (number) - Address of the device to read
* length (number) - Number of bytes to read

## Write

```
write <addr> <value>
```

Write a single byte to the provided address

Parameters:
* addr (number) - Address of the device to write to
* value (number) - Value to write (0-255)

## Write Buffer

```
write-buffer <addr> <...values>
```

Write an arbitrary number of bytes to the provided address.

Parameters:
* addr (number) - Address of the device to write to
* values (number[]) - Values to write. Each value must be between 0 and 255

Example:
```bash
# Write 1 2 3 4 to device at address 57
write-buffer 57 1 2 3 4
```
