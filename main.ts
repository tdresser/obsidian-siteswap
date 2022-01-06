import { App, Editor, MarkdownView, Modal, Plugin, PluginSettingTab, Setting, MarkdownPostProcessor, MarkdownPostProcessorContext, parseYaml, MarkdownPreviewRenderer } from 'obsidian';

// Remember to rename these classes and interfaces!

interface SiteswapSettings {
	width: number;
	height: number;
	fps: number;
	stereo: boolean;
	slowdown:number;
	border:number; 
	camangle: string;
	showground: "auto" | "true" | "false";
	hidejugglers:string;
}

const DEFAULT_SETTINGS: SiteswapSettings = {
	width: 400,
	height: 450,
	fps: 33.3,
	stereo: false,
	slowdown: 2,
	border: 0,
	camangle: "",
	showground: "auto",
	hidejugglers: "",
}


export default class SiteswapPlugin extends Plugin {
	settings: SiteswapSettings;

	static postprocessor = (source:string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		el.innerHTML = "";
		let failure : string | null = null;

		let yaml : any = null;
		try {
			yaml = parseYaml(source.replaceAll(":", ": "));
		} catch (e:any) {
			failure = e.message;
		}

		if (failure != null) {
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

		yaml["redirect"] = true;
		const params = Object.keys(yaml).map(key => key + '=' + encodeURIComponent(yaml[key])).join(';')

		console.log("TEXT")
		console.log(source);

		const img = document.createElement('img');
        img.src = "https://jugglinglab.org/anim?" + params;
		img.style.width = "200px";
		el.appendChild(img);
	}

	async onload() {
		await this.loadSettings();

		console.log('loading siteswap plugin');
		this.registerMarkdownCodeBlockProcessor("siteswap", SiteswapPlugin.postprocessor);

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
		this.settings = DEFAULT_SETTINGS;
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

		containerEl.createEl('h2', {text: 'Siteswap Settings'});

		const docs = document.createElement("div");
		docs.innerHTML = `<p>Detailed documentation can be found at 
		<a href="https://jugglinglab.org/html/animinfo.html">jugglinglab.org/html/animinfo.html</a>.</p>

		<p>These settings apply to all generated siteswap animations, but can be overridden by specifying
		these parameters in the pattern configuration.</p>
		`;
		containerEl.appendChild(docs);

		console.log(this.plugin.settings);


		new Setting(containerEl)
			.setName('width')
			.setDesc('Width of the generated GIF, in pixels.')
			.addSlider(slider => slider
				.setDynamicTooltip()
				.setLimits(10, 2000, 10)
				.setValue(this.plugin.settings.width)
				.onChange(async (value) => {
					this.plugin.settings.width = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('height')
			.setDesc('Height of the generated GIF, in pixels.')
			.addSlider(slider => slider
				.setValue(this.plugin.settings.height)
				.setDynamicTooltip()
				.setLimits(10, 2000, 10)
				.onChange(async (value) => {
					this.plugin.settings.height = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('fps')
			.setDesc('Number of frames per second in the generated GIF.')
			.addSlider(slider => slider
				.setValue(this.plugin.settings.height)
				.setDynamicTooltip()
				.setLimits(1, 200, 1)
				.onChange(async (value) => {
					this.plugin.settings.height = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('slowdown')
			.setDesc('Defines an overall time slowdown factor (e.g., slowdown=1.0 is actual speed, slowdown=2.0 is half actual speed).')
			.addSlider(slider => slider
				.setValue(this.plugin.settings.slowdown)
				.setDynamicTooltip()
				.setLimits(0.1,10,0.1)
				.onChange(async (value) => {
					this.plugin.settings.slowdown = value;
					await this.plugin.saveSettings();
				}));

		const showGroundOptions : Record<'auto' | 'true' | 'false', string> = {
			true: 'true',
			false: 'false',
			auto: 'auto'
		}
		new Setting(containerEl)
			.setName('showground')
			.setDesc('Whether to display the ground.')
			.addDropdown(dropdown => dropdown
				.addOptions(showGroundOptions)
				.setValue(this.plugin.settings.showground)
				.onChange(async (value) => {
					this.plugin.settings.showground = value as 'auto' | 'true' | 'false';
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('border')
			.setDesc('Defines a border (in pixels) around the animation.')
			.addSlider(slider => slider
				.setValue(this.plugin.settings.border)
				.setDynamicTooltip()
				.setLimits(0,10,1)
				.onChange(async (value) => {
					this.plugin.settings.border = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('camangle')
			.setDesc('Camera angles in degrees, given as one or a pair of angles. Example: camangle=(0,90). The first angle describes rotation of the camera around the juggler, and the second angle is the elevation angle given as degrees from directly overhead (i.e., 90 puts the camera on the same level as the juggler). Default value depends on the pattern.')
			.addText(text => text
				.setPlaceholder("(0,90)")
				.setValue(this.plugin.settings.camangle)
				.onChange(async (value) => {
					this.plugin.settings.camangle = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('hidejugglers')
			.setDesc('List of one or more jugglers to hide (i.e., not render) during animation. Examples: hidejugglers=1 or hidejugglers=(1,3).')
			.addText(text => text
				.setPlaceholder("(1,3)")
				.setValue(this.plugin.settings.hidejugglers)
				.onChange(async (value) => {
					this.plugin.settings.hidejugglers = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('stereo')
			.setDesc('Whether to display the pattern as a cross-eyed stereogram.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.stereo)
				.onChange(async (value) => {
					this.plugin.settings.stereo = value;
					await this.plugin.saveSettings();
				}));
		}
}
