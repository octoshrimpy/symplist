* base
  * does not track anything
  * has base components that plugins can use
    * page
    * button
    * slider
    * text input
    * password input
    * date
    * dateRange
    * counter
    * toggle
  * has stores that plugins can use
    * plugin.storage
    * pluginShared.storage

* plugins
  * period
  * fibro
  * migraines
  * mood
  * calorie intake
  * custom

* making pages on-the-fly from within the app?
* export plugins? (js/xml/json/cms/.plug)

---

## Plugin system

Each plugin will have an internal database for itself

Each plugin will have a shared database that other plugins can read data from, if controlling plugin has granted access

Each plugin will have a layouts file

Each plugin will have a components folder, where custom components only available to the plugin will sit

Each plugin will have access to the base components in the base app



---

## TODO

- [ ] +octo decide on plugin system
- [/] +octo build base components
    - @block: decide on /colou?rs/

- [/] +corm decide on /colou?rs/
- [/] +corm +honda +bek learn svelte
- [ ] +corm +diss +bek learn jasonelle
- [ ] +corm add wishlist.md
- [ ] +corm finish figma
- [ ] +honda(+corm +diss?) +bek row system

- [/] +diss plugin parser
    - @block: decide on plugin system
    - look into [JsChance](https://github.com/octoshrimpy/JSChance/blob/master/jschance.js) for parsing text/json into compileable code
