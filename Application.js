import Gtk from 'gi://Gtk?version=4.0';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import WebKit from 'gi://WebKit';

const APPLICATION_ID = 'dev.rehn.quick-chatgpt'

class Application {
    constructor() {
        this.app = new Gtk.Application({
            application_id: APPLICATION_ID,
            flags: Gio.ApplicationFlags.FLAGS_NONE,
        });

        this.app.connect('activate', this._onActivate.bind(this));
    }

    // Application activation callback
    _onActivate() {
        this._createWindow();
    }

    // Create the main application window
    _createWindow() {
        let window = new Gtk.ApplicationWindow({
            application: this.app,
            title: 'ChatGPT',
            default_height: 600,
            default_width: 370,
            decorated: false,
        });

        const appId = this.app.get_application_id();
        const appCacheDir = GLib.build_filenamev([GLib.get_user_cache_dir(), appId]);
        GLib.mkdir_with_parents(appCacheDir, 0o775)

        // Create a new WebKit WebView
        const webView = new WebKit.WebView();
        const networkSession = webView.get_network_session();

        const cookieManager = networkSession.get_cookie_manager();
        const cookiesFilename = GLib.build_filenamev([appCacheDir, 'cookies.sqlite']);
        cookieManager.set_persistent_storage(cookiesFilename, WebKit.CookiePersistentStorage.SQLITE);

        // Load a web page into the WebView
        webView.load_uri('https://chat.openai.com/chat');

        // Add the WebView to the window
        window.set_child(webView);

        // Show the window
        window.present();

        // Error handling for WebView
        webView.connect('load-failed', (webView, load_event, url, error) => {
            console.error(`Failed to load URL ${url}: ${error.message}`);
        });
    }

    // Run the application
    run(argv = []) {
        this.app.run(argv);
    }
}

function main() {
    let app = new Application();
    app.run(GLib.get_prgname() ? GLib.get_prgname().split(' ') : []);
}

if (import.meta.url.endsWith('/.local/share/gnome-shell/extensions/quick-chatgpt@rehn.dev/Application.js')) {
    main();
}
