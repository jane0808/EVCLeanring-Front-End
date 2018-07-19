import React, { Component } from 'react';
import AddItem from './Components/AddItem';
import './App.css'

class App extends Component {
 constructor(props){
   super(props)
   this.state = {
     list: [
       {
        name: "Watch movie",
        priority: "normal"
       },
       {
        name: "Buy vegetables",
        priority: "high"
       },
       {
        name: "Wash cloth",
        priority: "low"
       },
     ]     
   }
 }

  onAddItem = (item) => {
    console.log(item)
    console.log(this.state.list)
    const currentList = this.state.list
    this.setState({
      list: [
        ...currentList,
        item,
      ]
    },()=>{
      console.log(this.state.list)
    })
   
  }

 render() {
   const getTitle = () => "BlaBla"
   return (
    <div className="App">
     <h2>Todo list</h2>
     <AddItem onAdd={this.onAddItem} title={getTitle()}/>
        <div>
          {
            this.state.list.map((item) => {
              return <div>{item.name} - {item.priority}</div>
            })
          }
        </div>
     </div>
   )
    
   
 }
}

export default App;
