import { useState } from "react";
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text } from "react-native"

interface InputWordProps {
    callback: (word: string) => void
}

export function InputWord(props: InputWordProps) {
    const [word, setWord] = useState("");

    function clearInput() {
        setWord("");
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setWord}
                value={word}
            />
            <TouchableOpacity style={styles.button} onPress={() => { props.callback(word); clearInput(); }}>
                <Text style={styles.buttonText}>Check</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#18181A",
        borderRadius: 100,
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 15,
    },
    input: {
        color: 'white',
        fontSize: 16,
        paddingLeft: 10,
        flex: 1,
        height: 40,
    },
    button: {
        padding: 10,
        backgroundColor: "#18181A",
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
});