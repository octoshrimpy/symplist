class JsChance {
  constructor(text) {
    this.json = JsChance.textToJson(text)
    this.options = {}

    this.genFunctions()
  }

  static deepFind(obj, keys) {
    let found = obj
    keys.forEach(function (key) { found = found[key] })
    return found
  }

  static textToJson(text) {
    let lines = text.split("\n").filter(function (word) {
      return word.replace(/\s/ig, "").length > 0
    })

    let json = {}, current_obj = json, parents = [], prev_key = undefined, prev_indent = -1
    let regx_indent = new RegExp("  ", "g")

    lines.forEach(function (line) {
      let key = line.trim()
      let current_indent = line.match(/\s+/g)?.[0]?.match(regx_indent)?.length || 0

      if (current_indent > prev_indent) {
        if (prev_key) { parents.push(prev_key) }
        current_obj = current_obj[prev_key] || current_obj
      } else if (current_indent < prev_indent) {
        for (let i = 0; i < (prev_indent - current_indent); i++) { parents.pop() }
        current_obj = JsChance.deepFind(json, parents)
      }

      current_obj[key] = {}
      prev_indent = current_indent
      prev_key = key
    })

    return json
  }

  static isInt(num) {
    return !Number.isNaN(Number(num))
  }

  static rand() {
    let args = Array.from(arguments)

    if (args.length == 0) {
      return Math.random()
    } else if (args.length == 1) {
      let arg = args[0]
      if (this.isInt(arg)) { // Check if an int
        return Math.floor(this.rand() * Number(arg)) // 0-int (exclude int)
      } else if (/\d+\-\d+/.test(arg)) { // Is a num range like 10-15
        let [num1, num2] = arg.split("-")
        return this.rand(num1, num2)
      } else if (typeof arg == "string" && arg.includes("|")) {
        return this.rand(...arg.split("|"))
      } else if (Array.isArray(arg)) {
        return this.rand(...arg)
      } else {
        throw ("Not a valid argument: " + (typeof arg) + " (" + arg + ")")
      }
    } else if (args.length == 2 && this.isInt(args[0]) && this.isInt(args[1])) {
      // Num range like 10,15 inclusive
      let [min, max] = args.map(function (n) { return Number(n) })
      return Math.floor(this.rand() * (1 + max - min) + min)
    } else {
      return args[this.rand(args.length)]
    }
  }

  static parseText(text, parser) {
    let self = this
    let regx_square_brackets = /\[([^\[]*?)\]/ig
    do {
      text = text.replace(regx_square_brackets, function (full, group1) {
        if (parser && typeof parser[group1] == "function") {
          return parser[group1]()
        } else {
          return self.rand(group1)
        }
      })
    } while (regx_square_brackets.test(text))

    // console.log(text)
    return text
  }

  branchesFromJson(json, parents) {
    parents = parents || []
    let branches = []

    for (let [key, obj] of Object.entries(json)) {
      if (Object.keys(obj).length == 0) {
        branches.push([key])
      } else {
        branches = [...branches, ...this.branchesFromJson(obj, [key])]
      }
    }

    return branches.map(function (branch) {
      return [...parents, ...branch]
    })
  }

  genFunction(fnName, json_options) {
    let self = this
    if (!fnName) { return }

    self.options[fnName] = json_options
    self[fnName] = function () {
      let opts = this.branchesFromJson(json_options)
      var option = opts[Math.floor(Math.random() * opts.length)]
      option[option.length - 1] = self.constructor.parseText(option[option.length - 1], self)

      return option.length <= 1 ? option[0] : option
    }
  }

  genFunctions() {
    for (let [key, opts] of Object.entries(this.json)) {
      this.genFunction(key, opts)
    }
  }
}
// ===================
// preprocessor

class PreProcessor {
  static spacingOptions = {
    TWOSPACE: {
      literal: "  ",
      regexSelector: /\s{2}/g
    },
    FOURSPACE: {
      literal: "    ",
      regex: /\s{4}/g
    },
    TAB: {
      literal: "	",
      regex: /\t/g
    }
  }

  constructor() { }

  // @todo rocco clean this up lmao
  static parse(text) {
    this.spacing = PreProcessor.spacingOptions.TWOSPACE
    let lines = text.split("\n")

    this.shouldBeIndented = false

    this.detectedIndentCount = this.detectIndent(lines)
    lines = lines.flatMap((line, index) => {
      if (this.isLineOnlyComment(line)) {
        return []
      }
      line = this.tabsToSpaces(line)
      line = this.normalizeIndents(line)
      line = this.titleToGenerator(line, index)
      line = this.indentHeaderChildLine(line)
      line = this.removeMdList(line)

      return [line]
    })
    // console.log(lines.join('\n'))
    return lines.join('\n')
  }

  static removeMdList(text) {
    let mdListRegex = /(?<=^(\s+)?)((\d+\.\s)|(\*\s)|(\-\s))/g
    return text.replace(mdListRegex, "")
  }

  static tabsToSpaces(line) {
    return line.replace(/\t/g, this.spacingOptions.TWOSPACE.literal)
  }

  static normalizeIndents(line) {
    return line.replace(`/\s{${this.detectedIndentCount}}/g`, this.spacing.literal)
  }

  static indentHeaderChildLine(line) {
    if (!line || !!line.match(/(?<=^)(\s)+(?=$)/g)) {
      this.shouldBeIndented = false
      return line
    }
    if (this.shouldBeIndented) {
      // Only add the literal if we actually have the `shouldBeIndented` set
      line = this.spacing.literal + line
    }
    // Doing the indent before the check below so that we don't indent the line with ## as well
    if (!!line.match(/(?<=^(\s?)+(##\s+)\b).+/g)) {
      this.shouldBeIndented = true
      let lineHeaderStartRegex = /(?<=^(\s?)+)(##\s+)\b/g
      line = line.replace(lineHeaderStartRegex, "* ") // Replace doesn't modify inline, have to reassign the variable
    }

    return line
  }

  static isLineOnlyComment(line) {
    // grabs html comments as well as md line breaks: `--- / ===`
    let lineComment = /(?<=^)(\s?)+((<!--).+(-->)|(---+)|(===+))(?=$)/g

    return !!line.match(lineComment)
  }

  static titleToGenerator(line, index) {
    if (index == 0) {
      return line.replace('#', '*')
    }

    // if (index == 1) {
    //   let outputRegex = /(?<=^(\s?)+(_)).+(?=_$)/g
    //   let match = line.match(outputRegex)
    //   return PreProcessor.spacingOptions.TWOSPACE.literal + "* " + match[0]
    // }

    if (index > 0) {
      return line
    }
  }

  //https://medium.com/firefox-developer-tools/detecting-code-indentation-eff3ed0fb56b
  static detectIndent(lines) {
    var indents = {}; // # spaces indent -> # times seen
    var last = 0;     // # leading spaces in the last line we saw

    lines.forEach(function (text) {
      // var width = this.detectIndent(text); .// replaced with regex below
      var width = text.match(/^\s*/)[0].length;

      var indent = Math.abs(width - last);
      if (indent > 1) {
        indents[indent] = (indents[indent] || 0) + 1;
      }
      last = width;
    });

    // find most frequent non-zero width difference
    var indent = null, max = 0;
    for (var width in indents) {
      width = parseInt(width, 10);
      var tally = indents[width];
      if (tally > max) {
        max = tally;
        indent = width;
      }
    }
    return indent;
  }
}


//=====

let string =
`# Landmarks

## Blue
* Natural
    1. Series of small waterfalls
    1. Small "empty" lake 
        *   Water is crystal clear
    1. Reflective ponds 
        *   You cannot see the bottom of it
    1. Waterfall 
        *   Reverses direction of water on full moon
        *   Just the waterfall, not the rest of water around it
    1. Left-footed water
        *   To penetrate water, first stick your left foot in.
        *   Anyone stepping into water with their right foot will walk on the water. 
    1. Three worried stones 
        *   They're looking into a lake
        *   They disappear when not being looked at
        *   Found hiding nearby
        *   Reappear by lake if nobody nearby
* Manmade
1. Grounded pirate ship
    1. Offensive statue
        *   Labelled as "the \`1d6 adjective\` person alive"
        *   Changes how it looks to be whoever is currently looking at it
        <!-- @think Revise adjectives to be all one-word negatives -->
        1.  Ugliest
        2.  Dumbest
        3.  Most indecisive
        4.  Most incompetent
        5.  Most ambitious
        6.  Most clumsy
    1. Large well
        *   Bottom leads to air-filled underwater glass-walled dungeon
    1. Floating boulder
        *   Carved with glowing script that describes what is happening around it this very moment
    1. Large arcs 
        *   Were used as portals but are deactivated now
        *   Carved runes glow softly on the surface
    1. Library 
        *   Maintained by ghosts with no voice 
        *   All the books are filled with proper titles and chapter headings, but the contents of the pages are nonsense


## Yellow
* Natural
    1. Shelter / Ice cave
    1. Mushroom rings
    1. Glacier
        <!-- [?] :octoshrimpy missing lore -->
        <!--@todo Standardize all landmark names (Eliminate "a") -->
        * Optional earth / stone golem stuck in a piece of ice.
            * If you ask them what they're doing, they'll tell you they're "swimming in da river" (because they move so slow)
    1. Salt flats
    1. Bird hill
        *   Birds wil always be on it
        *   Migratory birds divert to fly over it
    1. "HOPE" tree
        *   Hope carved into it, nobody knows who or why
        *   Predates everyone in the area
* Manmade
    1. Glass tree
        *   Shatters anything that tries to break it
        *   Has carved sign telling the stories of a dwarven king
    1. Giant banner 
        *   Placed on very tall flagpole
    1. Tall weathered lone tower
        *   Skeleton on ground under window outside
        *   Has winding staircase with a puzzle
        *   Top of tower is filled with hair, and a pair of scissors on windowsill. 
    1. Giant crystal shard 
        *   Sticks out of ground
    1. Giant clock statue
        *   Hands move backwards
    1. Sacred sanctuary 
        *   Anyone who steps foot within does not need to rest for 1d4 days


## Purple
* Natural
    1. Sinkhole
    1. Glowing water 
        *   Water is dangerous
    1. Massive skull 
        *   Creatures live within
    1. Battlefield 
        *   Scattered skeletons in piles
    1. Giant rusted 50ft sword 
        *   Stabbed into ground
        *   All animals / plants avoid the area around it
    1. Area of petrified trees
* Manmade
    1. Large obelisk
        *   Does not reflect any light 
        *   Faintly glows purple whenever spirit orbs are around
    2. Hanging Gardens
        *   Like Hanging Gardens of Babylon
        *   Filled to the brim with plants
        *   \`optional\`: All the plants are dead
    3. Graveyard
        *   A few empty graves with broken coffins at the bottom
        *   \`optional\`: Name of PCs on a few gravestones
    4. Castle sunken into ground
        *   No way in
    5. Giant's Chess
        *   A large chess set carved out of one stone
        *   The game carved to a chess mate
        *   The pieces are medium sized
    6. Hangman's trees
        *   Some with skeletons



## Red
* Natural
    1. Empty lava tubes
    1. Giant dead carcass
    1. Hoodoos (sandstone / wind formation)
    1. Giant perfect round stone
        *   Always warm
    1. Changeling Fountain
        *   Fluid pours out of rock
        *   Changes once it hits the pool below
        *   Fluids are different for everyone
        *   Once someone pulls fluid out of fountain / pool, everyone sees that fluid. 
        *   \`lava\`, \`water\`, \`mud\`, \`beer\`, \`wine\`, \`acid\`, \`milk\`, \`saltwater\`, \`blood\`, \`feywater\` (random magical effect every time drank)
    1. Giant's playground
        *   Stone clearing with giant footprints embedded
* Manmade
    1.  Altar stone 
        *   Sits atop a hill
        *   Surrounded by charred skeletons
        *   It has a crack through the middle
        *   Inscription describes a god that nobody worships
        *   It catches fire every solstice for 24 hours

    1. Large sand castle 
        *   Inhabited by non-verbal gnomes
    1. Military outpost
        *   Good condition
        *   Well stocked
        *   No people
    1. Small shack 
        *   Leads to underground cavern where illegal pet fighting happens
    1. Forge 
        *   Ran by faeries
        *   Used to create otherwise non-obtainable items and tools
    <!-- @todo add explanation in a lore folder -->
    1. Gym's Jim 
        *   Bigger-on-the-inside shack with concealed portal to a central gym. 
        *   Working out here gives +1 STR or CHR until end of next battle. 
        *   The "gym" is always the same

## Green
* Natural
    1. Clearing
    1. Tree canopy tunnel
    1. Giant lone redwood
    1. Swordleaf trees
        *   Leaves are razor-sharp
        *   Branches appear to be rustling in strong "wind", even if there is no wind at all
    1. Drawing Moss
        *   Stones covered in mossy doodles and handprints
        *   Drawing with your finger on a stone where there is no moss causes the moss to slowly migrate to where you drew
    1. Candle trees
        *   Bright red leaves, contrasting well against otherwise green forest
        *   Leaves can be brewed into tea, warms down to bones even in coldest of weather
* Manmade
    <!-- @todo add explanation in a lore folder -->
    1. Small treehouse village
        *   Abandoned
    1. Taller tree 
        *   Has KNW or CHR NPC living within
    1. Giant serpent skeleton
        *   The inside of the skull is carved with the story of how a tribe of halflings killed it
    1. Magical hedge maze
        *   The walls change after every step taken within
        *   The center is never reachable
    1. Abandoned winery
        *   Hidden trapdoor to cellar
        *   Filled with magical wine, labelled "iridium fruit"
    1. Sword in stone
        *   Completely covered in vines
        *   Whoever pulls it out (anyone can) starts slowly turning into gold from feet up until sword is put back. Once sword is back, the gold disappears immediately. It's all an illusion


---

## Extras
* Sprouts of magic mushrooms
    *   When touched give the person full 10 on charm. the person actually has a -2 CHR for a few weeks
* Giant's wooden croc shoe
* Challenge stone
    *   When someone picks it up, an engraving in red and gold letters appears, issuing a challenge relating to a random house. nothing happens if challenge is completed
* Crater with tiny meteor in the middle

---

color
    Blue
    Yellow
    Purple
    Red
    Green

generate
    [[color]]
`

let landmarkGenerator = new JsChance(PreProcessor.parse(string))

let landmark_1 = landmarkGenerator.generate()

console.log(landmarkGenerator.generate());
console.log(landmarkGenerator.generate());
console.log(landmarkGenerator.generate());
