/**
 * @name SteamAppLinks
 * @author Oni-Chan-inc
 * @version 0.0.1
 * @description Opens Steam Links from people's Profiles and in discord in Steam app
 * @website https://waa.ai/nugget
 * @source https://github.com/Oni-Chan-inc/SteamAppLinks
 */

 module.exports = (_ => {
	const config = {
		"info": {
			"name": "SteamAppLinks",
			"author": "Oni-Chan-inc",
			"version": "0.0.1",
			"description": "Opens Steam Links from people's Profiles and in discord in Steam app"
		}
	};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		getName () {return config.info.name;}
		getAuthor () {return config.info.author;}
		getVersion () {return config.info.version;}

	} : (([Plugin, BDFDB]) => {
		const urls = {
			steam: ["https://steamcommunity.", "https://help.steampowered.", "https://store.steampowered.", "a.akamaihd.net/"]
		};
		
		return class SteamAppLinks extends Plugin {
			onLoad () {}
			
			onStart () {
				for (let key in urls) BDFDB.ListenerUtils.add(this, document, "click", urls[key].map(url => url.indexOf("http") == 0 ? `a[href^="${url}"]` : `a[href*="${url}"][href*="${key}"]`).join(", "), e => {
					this.openIn(e, key, e.currentTarget.href);
				});
			}
			
			onStop () {}
		
			openIn (e, key, url) {
				let platform = BDFDB.LibraryModules.StringUtils.upperCaseFirstChar(key);
				if (typeof this[`openIn${platform}`] == "function") {
					BDFDB.ListenerUtils.stopEvent(e);
					this[`openIn${platform}`](url);
					return true;
				}
				return false;
			}

			openInSteam (url) {
				BDFDB.LibraryRequires.request(url, (error, response, body) => {
					if (BDFDB.LibraryRequires.electron.shell.openExternal("steam://openurl/" + response.request.href));
					else BDFDB.DiscordUtils.openLink(response.request.href);
				});
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();