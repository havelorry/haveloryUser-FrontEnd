import React from "react"
import {TouchableOpacity,Text,View} from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

const RoundButton = (props) => <TouchableOpacity onPress={
	()=>{
		props.onPress()
	}
} style={{
		borderWidth:2,
		width:props.width || '70%',
		borderColor:props.border || '#fff',
		borderRadius:50,
		backgroundColor:props.background || 'transparent'
	}}>
	<Text style={{
		fontSize: props.size || 30,
		color:props.color,
		textAlign:'center',
		padding:props.spacing || 15,
		fontWeight:'bold'
	}}
	
	disabled ={props.disabled || false}
	>
		{props.children}
	</Text>
</TouchableOpacity>


const Link = (props) => <View>
	{
		props.hide 
		?
		null
		:
		<TouchableOpacity onPress={
			() => {
				props.onPress()
			}
		}>
			<Text style={{textDecorationLine:props.isUnderlined ?'underline':'none', color:props.color || '#fff'}}>
				{props.children}
			</Text>
		</TouchableOpacity>

	}
</View>

const styles = {
	width:'auto',
    alignItems:'center',
    backgroundColor: '#FFF',
}

const Group = (props) => <>
	{
		props.children
	}
</>

const Space = () => <View style={{
	width:'100%',
	height:10
}}>

</View>


const CircleButton = (props) => <TouchableOpacity style={{
	backgroundColor:'#8a2be2',
	borderRadius:50,
	width:60,
	height:60,
	justifyContent:'center',
	alignItems:'center',
}} onPress={props.onPress}



>
	{
		props.fetching ? <Animatable.View animation="rotate" iterationCount="infinite" easing="linear" >
			<Icon name="refresh" size={22} color="#fff" />
		</Animatable.View>
		:
		<Icon name="arrow-right" size={22} color="#fff" />
	}
</TouchableOpacity>


const OvalButton = (props) => <TouchableOpacity style={{
	backgroundColor:props.bg||'#8a2be2',
	borderRadius:50,
	width:props.size ||60,
	height:props.size ||60,
	justifyContent:'center',
	alignItems:'center',
	shadowColor: "#000000",
    elevation:5
	
}}

onPress= {
	() => {
		props.onPress()
	}
}
>
		{props.children}
</TouchableOpacity>



export {
	RoundButton,
	Link,
	Group,
	Space,
	CircleButton,OvalButton
}

