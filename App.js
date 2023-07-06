import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useWindowDimensions } from "react-native";
import RenderingEngine from "./RenderingEngine";
import html from "./html.json";

export default function App() {
  const { width } = useWindowDimensions();
  const paragraphs = html.paragraphs;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Article #1 </Text>
      {paragraphs.map((paragraph, index) => {
        return <RenderingEngine html={paragraph} width={width} key={index} />;
      })}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
});
