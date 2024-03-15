import Gtk from 'gi://Gtk?version=4.0';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import WebKit from 'gi://WebKit';

class Application {
    constructor() {
        this.application = new Gtk.Application({
            application_id: 'dev.rehn.GnomeChatGPT',
            flags: Gio.ApplicationFlags.FLAGS_NONE,
        });

        this.application.connect('activate', this._onActivate.bind(this));
    }

    // Application activation callback
    _onActivate() {
        this._createWindow();
    }

    // Create the main application window
    _createWindow() {
        let window = new Gtk.ApplicationWindow({
            application: this.application,
            title: "ChatGPT",
            default_height: 600,
            default_width: 800,
        });

        // Create a new WebKit WebView
        let webView = new WebKit.WebView();

        // Load a web page into the WebView
        webView.load_uri("https://chat.openai.com/chat");

        // Add the WebView to the window
        window.set_child(webView);

        // Show the window
        window.present();

        // Error handling for WebView
        webView.connect('load-failed', (webView, load_event, url, error) => {
            console.error(`Failed to load URL ${url}: ${error.message}`);
            // Optionally, display an error message to the user or take other appropriate actions
        });
    }

    // Run the application
    run(argv = []) {
        this.application.run(argv);
    }
}

function main() {
    let app = new Application();
    app.run(GLib.get_prgname() ? GLib.get_prgname().split(' ') : []);
}

if (import.meta.url.endsWith('/.local/share/gnome-shell/extensions/quick-chatgpt@rehn.dev/Application.js')) {
    main();
}
