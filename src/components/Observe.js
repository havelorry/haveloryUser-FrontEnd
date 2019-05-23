import React from "react"

export const withObservableStream = (observable,triggers) => Component => class extends React.Component{

    componentDidMount() {
      this.subscription = observable.subscribe(
          newState => this.setState({...newState})
      )
    }

    componentWillUnmount() {
        this.subscription.unsubscribe()
      }
    
      
    render() {
      return (
        <Component {...this.state} {...this.props} {...triggers}/>
      )
    }

    
}
