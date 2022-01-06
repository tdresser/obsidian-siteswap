import { SiteswapPlugin } from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface SiteswapSettings {
	width: number;
	height: number;
	fps: number;
	stereo: boolean;
	slowdown: number;
	border: number;
	camangle: string;
	showground: "auto" | "true" | "false";
	hidejugglers: string;
}

export const DEFAULT_SETTINGS: SiteswapSettings = {
	width: 400,
	height: 450,
	fps: 33.3,
	stereo: false,
	slowdown: 2,
	border: 0,
	camangle: "",
	showground: "auto",
	hidejugglers: "",
};

export class SiteswapSettingTab extends PluginSettingTab {
	plugin: SiteswapPlugin;

	constructor(app: App, plugin: SiteswapPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// TODO: maybe write a declarative wrapper for this? Or refactor somehow.
	// TODO: replace sliders with textfields that have validation.
	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Siteswap Settings" });

		const docs = document.createElement("div");
		docs.innerHTML = `<p>Detailed documentation can be found at 
		<a href="https://jugglinglab.org/html/animinfo.html">jugglinglab.org/html/animinfo.html</a>.</p>

		<p>These settings apply to all generated siteswap animations, but can be overridden by specifying
		these parameters in the pattern configuration.</p>
		`;
		containerEl.appendChild(docs);

		console.log(this.plugin.settings);

		new Setting(containerEl)
			.setName("width")
			.setDesc("Width of the generated GIF, in pixels.")
			.addSlider((slider) =>
				slider
					.setLimits(10, 2000, 10)
					.setValue(this.plugin.settings.width)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.width = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("height")
			.setDesc("Height of the generated GIF, in pixels.")
			.addSlider((slider) =>
				slider
					.setLimits(10, 2000, 10)
					.setValue(this.plugin.settings.height)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.height = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("fps")
			.setDesc("Number of frames per second in the generated GIF.")
			.addSlider((slider) =>
				slider
					.setLimits(1, 200, 1)
					.setValue(this.plugin.settings.height)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.height = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("slowdown")
			.setDesc(
				"Defines an overall time slowdown factor (e.g., slowdown=1.0 is actual speed, slowdown=2.0 is half actual speed)."
			)
			.addSlider((slider) =>
				slider
					.setLimits(0.1, 10, 0.1)
					.setValue(this.plugin.settings.slowdown)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.slowdown = value;
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
			.setName("border")
			.setDesc("Defines a border (in pixels) around the animation.")
			.addSlider((slider) =>
				slider
					.setLimits(0, 10, 1)
					.setValue(this.plugin.settings.border)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.border = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("camangle")
			.setDesc(
				"Camera angles in degrees, given as one or a pair of angles. Example: camangle=(0,90). The first angle describes rotation of the camera around the juggler, and the second angle is the elevation angle given as degrees from directly overhead (i.e., 90 puts the camera on the same level as the juggler). Default value depends on the pattern."
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
