import React from 'react'
const ModelContext  = React.createContext({})

const Modelprovider = ModelContext.Provider
export const ModelConsumer = ModelContext.Consumer

export default class  extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open:false
        }

        this.toggle = this.toggle.bind(this)


    }

    toggle(){
        this.setState(
            state => ({...state,open:!state.open})
        )
    }

    render() {
      return (
        <Modelprovider value={{
            open:this.state.open,
            toggle:this.toggle
        }}>
            {
                this.props.children
            }
        </Modelprovider>
      )
    }
}

