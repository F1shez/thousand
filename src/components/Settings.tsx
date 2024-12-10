import { Button, Text, View } from "react-native";

export function Settings() {
    return (
        <View>
            <Text>Settings</Text>
            <Button
                title="Reset frequency words"
                onPress={() => console.log("Pressed")}
            ></Button>
            <Button
                title="Поменять язык"
                onPress={() => console.log("Pressed")}
            ></Button>
            <Button
                title="Donate (^_^)"
                onPress={() => console.log("Pressed")}
            ></Button>
        </View>
    )
}