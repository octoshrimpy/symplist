// import {pages, components, storage} from  base

// temp until base done
// use for planning logic
let pages, components, storage
// end temp

class PluginParser {

  constructor(json) {
    let pagesCompiled = []

    for (let page in pages) {
      let pageContent = ""
      
      for (rowId, row of page.pageContent) {
        let rowContent = ""
        
        for (let content in row) {
          rowContent += this.buildElementFromJson(content)
        }
        pageContent += rowContent
      }

      pagesCompiled.push(pageContent)
    }

    let plugin = this.attachPagesToPlugin(pagesCompiled)
    plugin.storages = this.createStorages(plugin)
    
    this.attachPluginToApp(plugin)

    return plugin
  }

  //@think may not need these if building raw html
  buildElementFromJson(json) {}
  buildRowsFromElmArray(elmArray) {}
  buildPageFromRows(RowsArray) {}

  createStorages(plugin) {}

  loadComponents(components) {}

  attachPagesToPlugin(pages) {}

  attachPluginToApp(plugin) {}

}