import { App, Editor, MarkdownView, Modal, Plugin, PluginSettingTab, Setting, MarkdownPostProcessor, MarkdownPostProcessorContext, parseYaml } from 'obsidian';

// Remember to rename these classes and interfaces!

interface SiteswapSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: SiteswapSettings = {
	mySetting: 'default'
}

export default class SiteswapPlugin extends Plugin {
	settings: SiteswapSettings;

	static postprocessor: MarkdownPostProcessor = (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		const code = el.querySelector("pre code.language-siteswap");

		if (!code) return;
		console.log("CODE IS");
		console.log(code.outerHTML);

		const text = code.textContent;
		const yaml = parseYaml(text);

		console.log("TEXT")
		console.log(text);
		console.log("YAML");
		console.log(yaml);

		const pattern = text;
		el.innerHTML = code.textContent + `<img 
			width="200px"
			height="200px"
			src="https://jugglinglab.org/anim?redirect=true;pattern=${pattern}></img>`
	}

	async onload() {
		await this.loadSettings();

		console.log('loading siteswap plugin');
		this.registerMarkdownPostProcessor(SiteswapPlugin.postprocessor)

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));		
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: SiteswapPlugin;

	constructor(app: App, plugin: SiteswapPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
