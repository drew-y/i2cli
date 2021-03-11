#!/usr/bin/env node
import { CLI } from "cliffy";
import i2c from "i2c-bus";

let i2cl: i2c.PromisifiedBus | undefined = undefined;

const cli = new CLI()
    .addCommand("open", {
        parameters: [{ label: "bus", type: "number", optional: true, description: "Bus address. Defaults to 1." }],
        async action(p) {
            i2cl = await i2c.openPromisified(p.bus ?? 1);
            console.log("I2C Open");
        }
    })
    .addCommand("scan", {
        description: "Scan for connected devices. Will list the addresses of each device found.",
        async action() {
            i2clOpen(i2cl);

            const devices = await i2cl.scan();

            if (!devices) {
                console.log("No devices found.");
                return;
            }

            for (const dev of devices) {
                console.log(dev);
            }
            console.log("Done scanning.");
        }
    })
    .addCommand("read", {
        description: "Read a byte.",
        parameters: [
            { label: "addr", type: "number", description: "Device address." },
            { label: "radix", type: "number", description: "Device address.", optional: true },
        ],
        async action(p) {
            i2clOpen(i2cl);
            return i2cl.i2cRead(p.addr, 1, Buffer.alloc(1))
                .then(val => {
                    console.log(`Received:`);
                    console.log(val.buffer[0].toString(p.radix ?? 10));
                })
                .catch(e => {
                    console.log(`Error reading.`);
                    console.log(e);
                })
        }
    })
    .addCommand("read-buffer", {
        description: "Read a buffer.",
        parameters: [
            { label: "addr", type: "number", description: "Device address." },
            { label: "length", type: "number", description: "Device address." },
        ],
        async action(p) {
            i2clOpen(i2cl);
            return i2cl.i2cRead(p.addr, p.length, Buffer.alloc(p.length))
                .then(val => {
                    console.log(`Received:`);
                    console.dir(Array(...val.buffer));
                })
                .catch(e => {
                    console.log(`Error reading.`);
                    console.log(e);
                })
        }
    })
    .addCommand("write", {
        description: "Write a word.",
        parameters: [
            { label: "addr", type: "number", description: "Device address." },
            { label: "val", type: "number", description: "Value to write (0-255)" },
        ],
        async action(p) {
            i2clOpen(i2cl);
            await i2cl.i2cWrite(p.addr, 1, Buffer.from([p.val]))
                .catch(e => {
                    console.log(`Error writing.`);
                    console.log(e);
                })
        }
    })
    .addCommand("write-buffer", {
        description: "Write a buffer.",
        parameters: [
            { label: "addr", type: "number", description: "Device address." },
            { label: "vals", type: "number", description: "Values to write (0-255)", rest: true },
        ],
        async action(p) {
            i2clOpen(i2cl);
            await i2cl.i2cWrite(p.addr, 1, Buffer.from(p.vals))
                .catch(e => {
                    console.log(`Error writing.`);
                    console.log(e);
                })
        }
    });

cli.show();

function i2clOpen<T>(item?: T): asserts item is T {
    if (item === undefined) {
        throw new Error("I2C is not open. Call the open command.");
    }
}
