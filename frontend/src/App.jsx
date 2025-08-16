import { useState, useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import './App.css'

function App() {
  const { account, connected, connect, disconnect, signAndSubmitTransaction } = useWallet()
  const [eventData, setEventData] = useState({
    totalTickets: 100,
    soldTickets: 25,
    price: 10000000, // 0.1 APT in Octas
  })
  
  // Replace with your actual module address
  const MODULE_ADDRESS = '0xYOUR_MODULE_ADDRESS'
  
  // Fetch event data from the blockchain
  const fetchEventData = async () => {
    if (!connected || !account) return
    
    try {
      // For demo purposes, we'll use mock data
      // In a real app, you would fetch this from the blockchain
      setEventData({
        totalTickets: 100,
        soldTickets: 25,
        price: 10000000, // 0.1 APT in Octas
      })
      
      // Uncomment and modify this code to fetch real data
      /*
      const response = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${account.address}/resources`)
      const resources = await response.json()
      
      const eventResource = resources.find(
        (r) => r.type === `${MODULE_ADDRESS}::EventTicketing::Event`
      )
      
      if (eventResource) {
        setEventData({
          totalTickets: eventResource.data.total_tickets,
          soldTickets: eventResource.data.sold_tickets,
          price: eventResource.data.price,
        })
      }
      */
    } catch (error) {
      console.error('Error fetching event data:', error)
    }
  }

  useEffect(() => {
    if (connected) {
      fetchEventData()
    }
  }, [connected, account])

  // Create an event with sample values
  const createEvent = async () => {
    if (!connected) return
    
    try {
      const totalTickets = 100
      const price = 10000000 // 0.1 APT in Octas
      
      const payload = {
        function: `${MODULE_ADDRESS}::EventTicketing::create_event`,
        type_arguments: [],
        arguments: [account.address, totalTickets, price],
      }
      
      const response = await signAndSubmitTransaction(payload)
      console.log('Event created:', response)
      
      // Refresh event data after creation
      setTimeout(fetchEventData, 2000)
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  // Buy a ticket
  const buyTicket = async () => {
    if (!connected || !eventData) return
    
    try {
      const payload = {
        function: `${MODULE_ADDRESS}::EventTicketing::buy_ticket`,
        type_arguments: [],
        arguments: [account.address, account.address], // buyer, organizer
      }
      
      const response = await signAndSubmitTransaction(payload)
      console.log('Ticket purchased:', response)
      
      // Refresh event data after purchase
      setTimeout(fetchEventData, 2000)
    } catch (error) {
      console.error('Error buying ticket:', error)
    }
  }

  return (
    <div className="container">
      <h1>Event Ticketing dApp</h1>
      <p className="subtitle">Smart Contract: {MODULE_ADDRESS}</p>
      
      {!connected ? (
        <button className="wallet-button" onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <div className="wallet-info">
          <p>Connected: {account.address}</p>
          <button className="wallet-button" onClick={disconnect}>Disconnect</button>
        </div>
      )}
      
      {connected && (
        <div className="actions">
          <button className="action-button" onClick={createEvent}>Create Event</button>
          <button className="action-button" onClick={buyTicket}>Buy Ticket</button>
        </div>
      )}
      
      {connected && eventData && (
        <div className="event-info">
          <h2>Event Information</h2>
          <p>Total Tickets: {eventData.totalTickets}</p>
          <p>Sold Tickets: {eventData.soldTickets}</p>
          <p>Remaining Tickets: {eventData.totalTickets - eventData.soldTickets}</p>
          <p>Price: {eventData.price / 100000000} APT</p>
        </div>
      )}
      
      <div className="implementation-note">
        <h3>Implementation Note</h3>
        <p>This frontend connects to the Aptos blockchain using the Petra wallet.</p>
        <p>To use this dApp:</p>
        <ul>
          <li>Install the Petra wallet extension</li>
          <li>Connect your wallet using the button above</li>
          <li>Create an event or buy tickets using the action buttons</li>
        </ul>
        <p>Important: Replace the placeholder address with your actual deployed contract address.</p>
      </div>
    </div>
  )
}

export default App
