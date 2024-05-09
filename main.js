const app = Vue.createApp({
    data() {
        return {
            buffetList: [],
            searchText: '',
        }
    },

    computed: {
        listResult() {
            if (this.searchText === '') {
                return this.buffetList
            } else {
                return this.buffetList.filter(buffet => {
                    return buffet.brand_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    buffet.city.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    buffet.state.toLowerCase().includes(this.searchText.toLowerCase()) 
                })
            }
        },
    },

    methods: {
        async getBuffetList() {
            let response = await fetch('http://localhost:3000//api/v1/buffets')
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                let data = await response.json();
    
                this.buffetList = []
    
                data.forEach(buffet => {
                    this.buffetList.push(buffet)
                })
    
                console.log(this.buffetList)
            }
        }
    }
})

app.mount('#app')