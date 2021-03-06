import { Plugin, MarkdownPostProcessorContext, parseYaml } from "obsidian";
import {
	SiteswapSettingTab,
	SiteswapSettings,
	DEFAULT_SETTINGS,
} from "settings";

const defaultSettingsObject = Object.assign({}, DEFAULT_SETTINGS);

// See https://github.com/jkboyce/jugglinglab/blob/c0226400230714571de078893c46aef734856ebc/source/jugglinglab/notation/MHNNotationControl.java#L24
function expandBuiltInHandString(
	hands: string | undefined
): string | undefined {
	if (hands == undefined) {
		return undefined;
	}
	const BUILT_IN_HAND_STRINGS: Map<string, string> = new Map(
		Object.entries({
			inside: "(10)(32.5).",
			outside: "(32.5)(10).",
			half: "(32.5)(10).(10)(32.5).",
			mills: "(-25)(2.5).(25)(-2.5).(-25)(0).",
		})
	);
	return BUILT_IN_HAND_STRINGS.get(hands.toLowerCase()) || hands;
}

export class SiteswapPlugin extends Plugin {
	settings: SiteswapSettings;

	static postprocessor = (settings: SiteswapSettings) => {
		return (
			source: string,
			el: HTMLElement,
			ctx: MarkdownPostProcessorContext
		) => {
			let failure: string | null = null;

			let yaml = null;
			try {
				// Replacing ':' with ': ' is a bit of a hack, but we know a priori that keys and values will
				// never contain colons, so this is safe.
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
				message.style.color = "var(--text-error)";
				el.appendChild(message);
				return;
			}

			const paramsObject = { redirect: true, ...settings, ...yaml };
			const displayWidth = paramsObject.width;

			paramsObject.width = paramsObject.width / paramsObject.scale;
			paramsObject.height = paramsObject.height / paramsObject.scale;

			paramsObject.hands = expandBuiltInHandString(paramsObject.hands);

			// Don't pass default params. We want to fetched cached animations as much as possible,
			// and passing default params means we'll miss commonly cached animations.
			for (const key in paramsObject) {
				// Width and height are a bit tricky as the default used here isn't the default
				// for the gif generator. Special case those defaults here.
				if (key == "width" && paramsObject[key] == 400) {
					delete paramsObject["width"];
				} else if (key == "height" && paramsObject[key] == 450) {
					delete paramsObject["height"];
				} else {
					if (defaultSettingsObject[key] == paramsObject[key]) {
						delete paramsObject[key];
					}
				}
			}

			delete paramsObject.scale;

			const params = Object.keys(paramsObject)
				.map(
					(key) =>
						encodeURIComponent(key) +
						"=" +
						encodeURIComponent(paramsObject[key])
				)
				.join(";");

			const img = document.createElement("img");
			img.src = "https://jugglinglab.org/anim?" + params;
			img.style.width = displayWidth + "px";
			el.appendChild(img);
		};
	};

	async onload() {
		await this.loadSettings();

		console.log("loading siteswap plugin");
		this.registerMarkdownCodeBlockProcessor(
			"siteswap",
			SiteswapPlugin.postprocessor(this.settings)
		);

		this.addSettingTab(new SiteswapSettingTab(this.app, this));
	}

	onunload() {
		console.log("unloading siteswap plugin");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export default SiteswapPlugin;
