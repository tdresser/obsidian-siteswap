import { Editor, MarkdownView, Plugin, MarkdownPostProcessorContext, parseYaml } from 'obsidian';
import { SiteswapSettingTab, SiteswapSettings, DEFAULT_SETTINGS } from 'settings';

export class SiteswapPlugin extends Plugin {
	settings: SiteswapSettings;

	static postprocessor = (getSettings: () => SiteswapSettings) => {
		return (source:string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			el.innerHTML = "";
			let failure : string | null = null;

			let yaml : any = null;
			try {
				yaml = parseYaml(source.replaceAll(":", ": "));
			} catch (e:any) {
				failure = e.message;
			}

			if (failure != null) {
				// Pass.
			} else if (typeof(yaml) == "object") {
				if (!("pattern" in yaml)) {
					failure = 'Invalid siteswap: the "pattern" attribute is required.'
				}
			} else if (typeof(yaml) == "number" || typeof(yaml) == "string") {
				yaml = {
					"pattern": "" + yaml
				}
			} else {
				failure = "Invalid siteswap."
			}

			
			if (failure !== null) {
				const message = document.createElement('p');
				message.textContent = failure;
				message.style.color = "#ff0000";
				el.appendChild(message);
				return;
			}

			const paramsObject = Object.assign(getSettings(), yaml);
			console.log(paramsObject);

			paramsObject["redirect"] = true;
			const params = Object.keys(paramsObject).map(key => key + '=' + encodeURIComponent(paramsObject[key])).join(';')

			console.log(params);

			const img = document.createElement('img');
			img.src = "https://jugglinglab.org/anim?" + params;
			img.style.width = "200px";
			el.appendChild(img);
	}
}

	async onload() {
		await this.loadSettings();

		console.log('loading siteswap plugin');
		this.registerMarkdownCodeBlockProcessor("siteswap", SiteswapPlugin.postprocessor(() => this.settings));

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SiteswapSettingTab(this.app, this));		
	}

	onunload() {
		console.log('unloading siteswap plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export default SiteswapPlugin;