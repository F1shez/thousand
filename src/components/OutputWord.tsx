import { StyleSheet, Text, View } from "react-native";

interface OutputWordProps {
    word: string,
}

export function OutputWord(props: OutputWordProps) {
    return (
        <View style={styles.container}>
            {props.word ? (
                <Text style={styles.text}>{props.word}</Text>
            ) : (
                <Text style={styles.text}>Loading data...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 40,
        color: "#18181A"
    }
});