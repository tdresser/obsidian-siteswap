import { SiteswapPlugin } from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface SiteswapSettings {
	width: number;
	height: number;
	scale: number;
	fps: number;
	stereo: boolean;
	slowdown: number;
	camangle: string;
	showground: "auto" | "true" | "false";
	hidejugglers: string;
}

export const DEFAULT_SETTINGS: SiteswapSettings = {
	width: 200,
	height: 225,
	scale: 0.5,
	fps: 33,
	stereo: false,
	slowdown: 2,
	camangle: "",
	showground: "auto",
	hidejugglers: "",
};

function stripNonNumerals(x: string): string {
	return x.replaceAll(/\D/g, "");
}

export class SiteswapSettingTab extends PluginSettingTab {
	plugin: SiteswapPlugin;

	constructor(app: App, plugin: SiteswapPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// TODO: maybe write a declarative wrapper for this? Or refactor somehow.
	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Siteswap Settings" });

		const docs = document.createElement("div");
		docs.innerHTML = `<p>Detailed documentation can be found at 
		<a href="https://jugglinglab.org/html/animinfo.html">jugglinglab.org/html/animinfo.html</a>.</p>

		<p>These settings apply to all generated siteswap animations, but can be overridden by specifying
		these parameters in the pattern configuration.</p>

		<p>Note that existing animations won't update automatically after updating settings. 
		Turning the plugin off and on again is the easiest way to update everything.</p>
		`;
		containerEl.appendChild(docs);

		console.log(this.plugin.settings);

		new Setting(containerEl)
			.setName("width")
			.setDesc("Width of the animation, in pixels.")
			.addText((widget) =>
				widget
					.setValue("" + this.plugin.settings.width)
					.onChange(async (value) => {
						value = stripNonNumerals(value);
						widget.setValue(value);
						this.plugin.settings.width = parseInt(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("height")
			.setDesc("Height of the animation, in pixels.")
			.addText((widget) =>
				widget
					.setValue("" + this.plugin.settings.height)
					.onChange(async (value) => {
						value = stripNonNumerals(value);
						widget.setValue(value);
						this.plugin.settings.height = parseInt(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("scale")
			.setDesc(
				"Scaling factor for the generated GIF. 1.0 performs no scaling."
			)
			.addText((widget) =>
				widget
					.setValue("" + this.plugin.settings.scale)
					.onChange(async (value) => {
						value = stripNonNumerals(value);
						widget.setValue(value);
						this.plugin.settings.scale = parseInt(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("fps")
			.setDesc("Number of frames per second in the generated GIF.")
			.addText((widget) =>
				widget
					.setValue("" + this.plugin.settings.fps)
					.onChange(async (value) => {
						value = stripNonNumerals(value);
						widget.setValue(value);
						this.plugin.settings.fps = parseInt(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("slowdown")
			.setDesc(
				"Defines an overall time slowdown factor (e.g., slowdown: 1.0 is actual speed, slowdown: 2.0 is half actual speed)."
			)
			.addText((widget) =>
				widget
					.setValue("" + this.plugin.settings.slowdown)
					.onChange(async (value) => {
						value = stripNonNumerals(value);
						widget.setValue(value);
						this.plugin.settings.slowdown = parseInt(value);
						await this.plugin.saveSettings();
					})
			);

		const showGroundOptions: Record<"auto" | "true" | "false", string> = {
			true: "true",
			false: "false",
			auto: "auto",
		};
		new Setting(containerEl)
			.setName("showground")
			.setDesc("Whether to display the ground.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(showGroundOptions)
					.setValue(this.plugin.settings.showground)
					.onChange(async (value) => {
						this.plugin.settings.showground = value as
							| "auto"
							| "true"
							| "false";
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("camangle")
			.setDesc(
				"Camera angles in degrees, given as one or a pair of angles. Example: camangle: (0,90). The first angle describes rotation of the camera around the juggler, and the second angle is the elevation angle given as degrees from directly overhead (i.e., 90 puts the camera on the same level as the juggler). Default value depends on the pattern."
			)
			.addText((text) =>
				text
					.setPlaceholder("(0,90)")
					.setValue(this.plugin.settings.camangle)
					.onChange(async (value) => {
						this.plugin.settings.camangle = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("hidejugglers")
			.setDesc(
				"List of one or more jugglers to hide (i.e., not render) during animation. Examples: hidejugglers=1 or hidejugglers=(1,3)."
			)
			.addText((text) =>
				text
					.setPlaceholder("(1,3)")
					.setValue(this.plugin.settings.hidejugglers)
					.onChange(async (value) => {
						this.plugin.settings.hidejugglers = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("stereo")
			.setDesc(
				"Whether to display the pattern as a cross-eyed stereogram."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.stereo)
					.onChange(async (value) => {
						this.plugin.settings.stereo = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
