
interface CommandResponse<T> {
	id: string;
	command: string;
	error?: string;
	response?: T;
}

interface DeviceData {
	name: string;
	serial: string;
	isEmulator: boolean;
	isRunning: boolean;
}

class UtilWrapper
{
	public UtilPath: string;

	constructor(utilPath: string)
	{
		this.UtilPath = utilPath;
	}
	
	async RunCommand<TResult>(cmd: string, args: string[] = null)
	{
		var stdargs = [`-c=${cmd}`];
		
		if (args && args.length > 0)
		{
			for (var a in args)
				stdargs.push(a);
		}

		var proc = await execa(this.UtilPath, stdargs);
		var txt = proc['stdout'];

		return JSON.parse(txt) as CommandResponse<TResult>;
	}

	public async GetAndroidDevices()
	{
		var r = await this.RunCommand<Array<DeviceData>>("android-devices");
		return r.response;
	}
}

const path = require('path');
const execa = require('execa');

var exe = path.join(process.cwd(), 'VsCodeXamarinUtil', 'bin', 'Debug', 'netcoreapp3.1', 'vscode-xamarin-util.exe');
console.log(exe);

(async () => {
	let util = new UtilWrapper(exe);

	var devices = await util.GetAndroidDevices();
	for (var device of devices)
		console.log(device.serial + ' -> ' + device.name);
})();

