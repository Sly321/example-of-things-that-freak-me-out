import { ChildProcessWithoutNullStreams, spawn } from "child_process";

export class Powershell {
	private shell: ChildProcessWithoutNullStreams;
	private stdout: Array<string> = [];
	private stderr: Array<string> = [];

	constructor() {
		this.shell = spawn("powershell.exe", ["-NoProfile"], { cwd: "C:\\workspace" });

		this.shell.stdout.on("data", (data: any) => {
			this.stdout.push(data.toString());
		});

		this.shell.stdout.on("end", (data: any) => {
		});

		this.shell.stderr.on("data", (data: any) => {
			this.stderr.push(data);
		});

		this.shell.on("exit", function () {
		});
	}

	public async execute(cmd: string): Promise<void> {
		return new Promise((resolve) => {
			const self = this

			function waitFor(data: any) {
				if (data.toString().trim() === `executed ${cmd}`) {
					self.shell.stdout.off("data", waitFor)
					resolve()
				}
			}

			this.shell.stdout.on("data", waitFor)

			this.shell.stdin.write(`${cmd}\n`)
			this.shell.stdin.write(`echo "executed ${cmd}"\n`)
		})
	}

	public close() {
		this.shell.stdin.end()
	}
}

const shell = new Powershell();

(async function() {
	console.log("a")
	await shell.execute("Start-Sleep -Seconds 5")
	console.log("b")
	await shell.execute("Start-Sleep -Seconds 3")
	console.log("c")
	shell.close()
})()
