import {
	Editor,
	MarkdownView,
	Plugin,
	MarkdownPostProcessorContext,
	parseYaml,
} from "obsidian";
import {
	SiteswapSettingTab,
	SiteswapSettings,
	DEFAULT_SETTINGS,
} from "settings";

type PostProcessor = (
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext
) => void;

// TODO, add an attribute storing the current postprocessor, remove and reregister on settings update.
// We don't need to pass in getSettings, just curry the settings object.

export class SiteswapPlugin extends Plugin {
	settings: SiteswapSettings;
	postProcessor: PostProcessor;

	static postprocessor = (settings: SiteswapSettings) => {
		return (
			source: string,
			el: HTMLElement,
			ctx: MarkdownPostProcessorContext
		) => {
			el.innerHTML = "";
			let failure: string | null = null;

			let yaml = null;
			try {
				yaml = parseYaml(source.replaceAll(":", ": "));
			} catch (e) {
				failure = e.message;
			}

			if (failure != null) {
				// Pass.
			} else if (typeof yaml == "object") {
				if (!("pattern" in yaml)) {
					failure =
						'Invalid siteswap: the "pattern" attribute is required.';
				}
			} else if (typeof yaml == "number" || typeof yaml == "string") {
				yaml = {
					pattern: "" + yaml,
				};
			} else {
				failure = "Invalid siteswap.";
			}

			if (failure !== null) {
				const message = document.createElement("p");
				message.textContent = failure;
				message.style.color = "#ff0000";
				el.appendChild(message);
				return;
			}

			console.log("YAML");
			console.log(yaml);
			console.log("SETTINGS");
			console.log(settings);
			const paramsObject = { redirect: true, ...settings, ...yaml };
			console.log(paramsObject);

			const params = Object.keys(paramsObject)
				.map((key) => key + "=" + encodeURIComponent(paramsObject[key]))
				.join(";");

			console.log(params);

			const img = document.createElement("img");
			img.src = "https://jugglinglab.org/anim?" + params;
			img.style.width = "200px";
			el.appendChild(img);
		};
	};

	async onload() {
		await this.loadSettings();

		console.log("loading siteswap plugin");
		this.postProcessor = SiteswapPlugin.postprocessor(this.settings);
		this.registerMarkdownCodeBlockProcessor("siteswap", this.postProcessor);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SiteswapSettingTab(this.app, this));
	}

	onunload() {
		//this.postProcessor = SiteswapPlugin.postprocessor(this.settings);
		//this.register("siteswap", this.postProcessor);
		console.log("unloading siteswap plugin");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		this.settings = DEFAULT_SETTINGS;
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export default SiteswapPlugin;
