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
        description: "Read a word.",
        parameters: [
            { label: "addr", type: "number", description: "Device address." },
            { label: "cmd", type: "number", description: "Command code." }
        ],
        async action(p) {
            i2clOpen(i2cl);
            return i2cl.readWord(p.addr, p.cmd)
                .then(val => {
                    console.log(`Recieved: ${val}`);
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
            { label: "cmd", type: "number", description: "Command code." },
            { label: "word", type: "number", description: "Data to send (number between 0 and 65535)." }
        ],
        async action(p) {
            i2clOpen(i2cl);
            return i2cl.writeWord(p.addr, p.cmd, p.word)
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
