const { createApp } = Vue

const app = createApp({
    template: `
        <div class="appBlock">
            <h2>Total Points Remaining: {{remainingPoints}}</h2>
            <button type="button" @click="toggleStetup()">Toggle Setup</button>
        </div>
        <div v-show="globalSetup.showSetup" class="appBlock">
            <div class="statBlock">
                <div>
                    <label><p class="labelText">General Points</p></label>
                    <input type="number" v-model="globalSetup.genPoints">
                </div>
                <div>
                    <label><p class="labelText">Investigative Points</p></label>
                    <input type="number" v-model="globalSetup.invesPoints">
                </div>
                <div>
                    <label><p class="labelText">Experience Points</p></label>
                    <input type="number" v-model="globalSetup.expPoints">
                </div>
            </div>
        </div>
        <div class="appBlock">
            <h2>Lore Information</h2>
            <div class="characterInfo" id="genInfo">
                <div v-for="item in genInfo" :key="item.name">
                    <p class="labelText"><label :for="item.name"> {{item.name}} </label></p>
                    <input type="text" :name="item.name" v-model="item.value">
                </div>
            </div>
        </div>
        <div class="appBlock">
            <h2>Main Stats ({{genStatPoints}} used)</h2>
            <div class="statBlock" id="genStats">
                <div v-for="item in genStats" :key="item.name">
                    <p class="labelText"><label :for="item.name"> {{item.name}} </label></p>
                    <input type="number" :name="item.name" v-model="item.value">
                </div>
                <div>
                    <p class="labelText"><label :for="hitThreshold.name"> {{hitThreshold.name}} </label></p>
                    <input type="text" :value="hitThreshold.value" readonly>
                </div>
            </div>
        </div>
        <div class="appBlock">
            <h2>General Abilities ({{genAbilityPoints}} used)</h2>
            <div class="statBlock" id="genAbilities">
                <div v-for="item in genAbilities" :key="item.name">
                    <p class="labelText"><label :for="item.name"> {{getLabelCherry(item)}}</label></p>
                    <input :style="{'color':getColor(item.value)}" type="number" :name="item.name" v-model="item.value" :value="displayNumOrNothing(item.value)">
                </div>
            </div>
        </div>
        <div class="appBlock">
            <h2>Investigative Abilities ({{intestigativePoints}} * 3 = {{intestigativePoints*3}} used)</h2>
            <h3>Academic</h3>
            <div class="statBlock" id="invesAcademic">
                <div v-for="item in investigativeAbilities.academic" :key="item.name">
                    <p class="labelText"><label :for="item.name"> {{item.name}}</label></p>
                    <input :style="{'color':getColor(item.value)}" type="number" :name="item.name" v-model="item.value" :value="displayNumOrNothing(item.value)">
                </div>
            </div>
            <h3>Interpersonal</h3>
            <div class="statBlock" id="invesInterpersonal">
                <div v-for="item in investigativeAbilities.interpersonal" :key="item.name">
                    <p class="labelText"><label :for="item.name"> {{item.name}}</label></p>
                    <input :style="{'color':getColor(item.value)}" type="number" :name="item.name" v-model="item.value" :value="displayNumOrNothing(item.value)">
                </div>
            </div>
            <h3>Technical</h3>
            <div class="statBlock" id="invesTechnical">
                <div v-for="item in investigativeAbilities.technical" :key="item.name">
                    <p class="labelText"><label :for="item.name"> {{item.name}}</label></p>
                    <input :style="{'color':getColor(item.value)}" type="number" :name="item.name" v-model="item.value" :value="displayNumOrNothing(item.value)">
                </div>
            </div>
        </div>
        <div class="appBlock">
            <h2>Import/Export your data</h2>
            <textarea id="ioBlock" v-model="io"></textarea>
            <button type="button" @click="logData()">Generate Data Code</button>
            <button type="button" @click="importData()">Import Data from Text</button>
            <button type="button" @click="clearDataIO()">Clear Textbox</button>
        </div>
    `,
    methods: {
        getLabelCherry(item) {
            return `${item.name}${item.value >= 8 ? " 🍒" : ""}`
        },
        displayNumOrNothing(val) {
            return val ? val : ""
        },
        getColor(val) {
            return val ? "#EDD" : "#333"
        },
        logData() {
            this.io = JSON.stringify(this.$data)
        }, 
        importData() {
            if (this.io.length == 0) {
                return;
            } 
            let newData = JSON.parse(this.io);
            for (let item in newData) {
                this.$data[item] = newData[item];
            }
            this.globalSetup.showSetup = false;
        },
        clearDataIO() {
            this.io = "";
        },
        toggleStetup() {
            this.globalSetup.showSetup = !this.globalSetup.showSetup;
        }, 
    }, 
    computed: {
        hitThreshold() {
            return {name: "Hit Threshold", value: this.genAbilities[0].value >= 8 ? 4 : 3}
        }, 
        genStatPoints() {
            return this.genStats.reduce((prev, curr) => { return prev + (parseInt(curr.value) || 0) }, 0) - 33;
        },
        genAbilityPoints() {
            return this.genAbilities.reduce((prev, curr) => { return prev + (parseInt(curr.value) || 0) }, 0);
        },
        academicPoints() {
            return this.investigativeAbilities.academic.reduce((prev, curr) => { return prev + (parseInt(curr.value) || 0) }, 0);
        }, 
        interpersonalPoints() {
            return this.investigativeAbilities.interpersonal.reduce((prev, curr) => { return prev + (parseInt(curr.value) || 0) }, 0) - 2;
        }, 
        technicalPoints() {
            return this.investigativeAbilities.technical.reduce((prev, curr) => { return prev + (parseInt(curr.value) || 0) }, 0)
        }, 
        intestigativePoints() {
            return this.academicPoints + this.interpersonalPoints + this.technicalPoints;
        },
        remainingPoints() {
            return  (this.globalSetup.genPoints + this.globalSetup.invesPoints*3 + this.globalSetup.expPoints) - (this.intestigativePoints * 3 + this.genStatPoints +  this.genAbilityPoints)
        },
    
    },
    data() {
        return {
            globalSetup: {
                showSetup: false,
                genPoints: 70,
                invesPoints: 20,
                expPoints: 0
            },
            genInfo: [
                { name: "Name", value: "" },
                { name: "Drive", value: "" },
                { name: "MOS", value: "" }
            ],
            genStats: [
                { name: "Health", value: 4 },
                { name: "Stability", value: 4 },
                { name: "Cover", value: 10 },
                { name: "Network", value: 15}
            ],
            genAbilities: [
                { name: "Athletics", value: 0 },
                { name: "Conceal", value: 0 },
                { name: "Digital Intrusion", value: 0 },
                { name: "Disguise", value: 0 },
                { name: "Driving", value: 0 },
                { name: "Explosive Devices", value: 0 },
                { name: "Filch", value: 0 },
                { name: "Gambling", value: 0 },
                { name: "Hand-to-Hand", value: 0 },
                { name: "Infiltration", value: 0 },
                { name: "Mechanics", value: 0 },
                { name: "Medic", value: 0 },
                { name: "Piloting", value: 0 },
                { name: "Preparedness", value: 0 },
                { name: "Sense Trouble", value: 0 },
                { name: "Shooting", value: 0 },
                { name: "Shrink", value: 0 },
                { name: "Surveillance", value: 0 },
                { name: "Weapons", value: 0 },
            ],
            investigativeAbilities: {
                academic: [
                    { name: "Accounting", value: 0 },
                    { name: "Archaeology", value: 0 },
                    { name: "Architecture", value: 0 },
                    { name: "Art History", value: 0 },
                    { name: "Criminology", value: 0 },
                    { name: "Diagnosis", value: 0 },
                    { name: "History", value: 0 },
                    { name: "Human Terrain", value: 0 },
                    { name: "Languages", value: 0 },
                    { name: "Law", value: 0 },
                    { name: "Military Science", value: 0 },
                    { name: "Occult Studies", value: 0 },
                    { name: "Research", value: 0 },
                    { name: "Vampirology", value: 0 },
                ],
                interpersonal: [
                    { name: "Bullshit Detector", value: 0 },
                    { name: "Bureaucracy", value: 0 },
                    { name: "Cop Talk", value: 0 },
                    { name: "Flattery", value: 0 },
                    { name: "Flirting", value: 0 },
                    { name: "High Society", value: 0 },
                    { name: "Interrogation", value: 0 },
                    { name: "Intimidation", value: 0 },
                    { name: "Negotiation", value: 0 },
                    { name: "Reassurance", value: 0 },
                    { name: "Streetwise", value: 1 },
                    { name: "Tradecraft", value: 1 }
                ],
                technical: [
                    { name: "Astronomy", value: 0 },
                    { name: "Chemistry", value: 0 },
                    { name: "Cryptography", value: 0 },
                    { name: "Data Recovery", value: 0 },
                    { name: "Electronic Surveillance", value: 0 },
                    { name: "Forensic Pathology", value: 0 },
                    { name: "Forgery", value: 0 },
                    { name: "Notice", value: 0 },
                    { name: "Outdoor Survival", value: 0 },
                    { name: "Pharmacy", value: 0 },
                    { name: "Photography", value: 0 },
                    { name: "Traffic Analysis", value: 0 },
                    { name: "Urban Survival", value: 0 }
                ]
            }, 
            io: ""
        }
    }
})

addEventListener('DOMContentLoaded', (event) => {
    app.mount('#app')
});
