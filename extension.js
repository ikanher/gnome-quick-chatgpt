/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('ChatGPT'));

        let icon = new St.Icon({
            icon_name: 'face-smile-symbolic',
            style_class: 'system-status-icon',
        });

        this.add_child(icon);
        this.connect('button-press-event', this._onButtonPress.bind(this));
    }

    _onButtonPress() {
        console.log('!!! BUTTON PRESSED')
        this._launchGTKApplication();
    }

    _launchGTKApplication() {
        const extensionObject = Extension.lookupByURL(import.meta.url);
        const dir = extensionObject.metadata.path;
        const appPath = `${dir}/Application.js`;

        let subprocessLauncher = new Gio.SubprocessLauncher({
            flags: Gio.SubprocessFlags.NONE,
        });

        let subprocess = Gio.Subprocess.new(
            ['gjs', '--module', appPath],
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        );

        subprocess.communicate_utf8_async(null, null, (source, result) => {
            try {
                let [, stdout, stderr] = source.communicate_utf8_finish(result);
                if (stderr) {
                    log(`Application.js error: ${stderr}`);
                }
                if (stdout) {
                    log(`Application.js output: ${stdout}`);
                }
            } catch (e) {
                log(`Failed to execute Application.js: ${e.message}`);
            }
        });
    }
});

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
