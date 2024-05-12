const app = Vue.createApp({
    data() {
        return {
            buffetList: [],
            eventList: [],
            availability: [],
            searchText: '',
            showEventsModal: false,
            date: {},
            guests: {}
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
    async mounted () {
        this.listResult = await this.getBuffetList()
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
        },

        async getBuffetDetails(id) {
            let response = await fetch(`http://localhost:3000//api/v1/buffets/${id}/events`)
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                let data = await response.json();

                this.eventList = data.map(event => {
                    event.alcohol = event.alcohol.toString()
                    event.at_buffet_location = event.at_buffet_location.toString()
                    event.buffet_id = parseInt(event.buffet_id)
                    event.created_at = new Date(event.created_at)
                    event.decoration = event.decoration.toString()
                    event.duration = parseInt(event.duration)
                    event.id = parseInt(event.id)
                    event.max_people = parseInt(event.max_people)
                    event.min_people = parseInt(event.min_people)
                    event.parking_service = event.parking_service.toString()
                    event.updated_at = new Date(event.updated_at)
                    return event;
                })
    
                console.log(this.eventList)
            }
        },

        async checkAvailability(buffet, event, index) {

            const response = await fetch(`http://localhost:3000/api/v1/buffets/${buffet.id}/events/${event.id}/availability?date=${this.date[index]}&guests=${this.guests[index]}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                this.availability[index] = data;
                console.log(this.availability);
            }
        },

        openModal(id) {
            this.getBuffetDetails(id);
            this.showEventsModal = true;
        },

        closeModal() {
            this.showEventsModal = false
        }
    }
})

app.mount('#app')