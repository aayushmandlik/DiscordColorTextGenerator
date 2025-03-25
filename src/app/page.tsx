"use client";

import type React from "react";
import "./globals.css";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  Text,
  Title,
  Tooltip,
  createTheme,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";

// Define ANSI color codes and their corresponding CSS classes
const styleButtons = [
  { ansi: "0", label: "Reset All", className: "" },
  { ansi: "1", label: "Bold", className: "ansi-1" },
  { ansi: "4", label: "Line", className: "ansi-4" },
];

const fgColors = [
  { ansi: "30", color: "#4f545c", tooltip: "Dark Gray (33%)" },
  { ansi: "31", color: "#dc322f", tooltip: "Red" },
  { ansi: "32", color: "#859900", tooltip: "Yellowish Green" },
  { ansi: "33", color: "#b58900", tooltip: "Gold" },
  { ansi: "34", color: "#268bd2", tooltip: "Light Blue" },
  { ansi: "35", color: "#d33682", tooltip: "Pink" },
  { ansi: "36", color: "#2aa198", tooltip: "Teal" },
  { ansi: "37", color: "#ffffff", tooltip: "White" },
];

const bgColors = [
  { ansi: "40", color: "#002b36", tooltip: "Blueish Black" },
  { ansi: "41", color: "#cb4b16", tooltip: "Rust Brown" },
  { ansi: "42", color: "#586e75", tooltip: "Gray (40%)" },
  { ansi: "43", color: "#657b83", tooltip: "Gray (45%)" },
  { ansi: "44", color: "#839496", tooltip: "Light Gray (55%)" },
  { ansi: "45", color: "#6c71c4", tooltip: "Blurple" },
  { ansi: "46", color: "#93a1a1", tooltip: "Light Gray (60%)" },
  { ansi: "47", color: "#fdf6e3", tooltip: "Cream White" },
];

// Custom theme
const theme = createTheme({
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5c5f66",
      "#373A40",
      "#2C2E33",
      "#25262b",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
});

export default function DiscordTextGenerator() {
  const textareaRef = useRef<HTMLDivElement>(null);
  const [copyButtonText, setCopyButtonText] = useState(
    "Copy text as Discord formatted"
  );
  const [copyButtonColor, setCopyButtonColor] = useState("#4f545c");
  const [copyCount, setCopyCount] = useState(0);

  useEffect(() => {
    // Initialize the textarea with the welcome text
    if (textareaRef.current) {
      textareaRef.current.innerHTML = `Welcome to <span class="ansi-33">Rebane</span>'s <span class="ansi-45"><span class="ansi-37">Discord</span></span> <span class="ansi-31">C</span><span class="ansi-32">o</span><span class="ansi-33">l</span><span class="ansi-34">o</span><span class="ansi-35">r</span><span class="ansi-36">e</span><span class="ansi-37">d</span> Text Generator!`;
    }
  }, []);

  // Handle applying styles to selected text
  const applyStyle = (ansi: string) => {
    if (!textareaRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (ansi === "0") {
      // Reset all formatting
      textareaRef.current.innerText = textareaRef.current.innerText;
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    // Create a span with the appropriate class
    const span = document.createElement("span");
    span.innerText = selectedText;

    // Apply the correct class based on the ANSI code
    if (ansi >= "30" && ansi < "40") {
      // Foreground color
      span.classList.add(`ansi-${ansi}`);
    } else if (ansi >= "40") {
      // Background color
      span.classList.add(`ansi-${ansi}`);
    } else {
      // Style (bold, underline)
      span.classList.add(`ansi-${ansi}`);
    }

    // Replace the selected text with the styled span
    range.deleteContents();
    range.insertNode(span);

    // Keep the selection on the newly created span
    range.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Convert DOM nodes to ANSI escape sequences
  const nodesToANSI = (
    nodes: NodeListOf<ChildNode> | Array<ChildNode>,
    states: Array<{ fg: number; bg: number; st: number }>
  ) => {
    let text = "";
    for (const node of nodes) {
      if (node.nodeType === 3) {
        // Text node
        text += node.textContent;
        continue;
      }
      if (node.nodeName === "BR") {
        text += "\n";
        continue;
      }

      // Handle span elements with ansi classes
      if (node.nodeName === "SPAN" && node instanceof HTMLElement) {
        const className = node.className;
        if (!className.includes("ansi-")) continue;

        const ansiCode = +className.split("-")[1];
        const newState = Object.assign({}, states.at(-1));

        if (ansiCode < 30) newState.st = ansiCode;
        if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
        if (ansiCode >= 40) newState.bg = ansiCode;

        states.push(newState);
        text += `\x1b[${newState.st};${
          ansiCode >= 40 ? newState.bg : newState.fg
        }m`;
        text += nodesToANSI(node.childNodes, states);
        states.pop();
        text += `\x1b[0m`;
        if (states.at(-1)!.fg !== 2)
          text += `\x1b[${states.at(-1)!.st};${states.at(-1)!.fg}m`;
        if (states.at(-1)!.bg !== 2)
          text += `\x1b[${states.at(-1)!.st};${states.at(-1)!.bg}m`;
      }
    }
    return text;
  };

  // Handle copy button click
  const handleCopy = () => {
    if (!textareaRef.current) return;

    const toCopy =
      "```ansi\n" +
      nodesToANSI(textareaRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) +
      "\n```";

    navigator.clipboard
      .writeText(toCopy)
      .then(() => {
        const funnyCopyMessages = [
          "Copied!",
          "Double Copy!",
          "Triple Copy!",
          "Dominating!!",
          "Rampage!!",
          "Mega Copy!!",
          "Unstoppable!!",
          "Wicked Sick!!",
          "Monster Copy!!!",
          "GODLIKE!!!",
          "BEYOND GODLIKE!!!!",
          Array(16)
            .fill(0)
            .reduce(
              (p) => p + String.fromCharCode(Math.floor(Math.random() * 65535)),
              ""
            ),
        ];

        setCopyButtonColor(copyCount <= 8 ? "#3BA55D" : "#ED4245");
        setCopyButtonText(funnyCopyMessages[copyCount]);
        setCopyCount(Math.min(11, copyCount + 1));

        setTimeout(() => {
          setCopyCount(0);
          setCopyButtonColor("#4f545c");
          setCopyButtonText("Copy text as Discord formatted");
        }, 2000);
      })
      .catch((err) => {
        if (copyCount > 2) return;
        alert(
          "Copying failed for some reason, let's try showing an alert, maybe you can copy it instead."
        );
        alert(toCopy);
      });
  };

  // Handle input to escape HTML tags
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const base = target.innerHTML.replace(
      /<(\/?(br|span|span class="ansi-[0-9]*"))>/g,
      "[$1]"
    );
    if (base.includes("<") || base.includes(">")) {
      target.innerHTML = base
        .replace(/<.*?>/g, "")
        .replace(/[<>]/g, "")
        .replace(/\[(\/?(br|span|span class="ansi-[0-9]*"))\]/g, "<$1>");
    }
  };

  // Handle Enter key to insert line break
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      document.execCommand("insertLineBreak");
      e.preventDefault();
    }
  };

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Box bg="#36393F" mih="100vh" py="xl">
        <Container size="md">
          <Title order={1} ta="center" mb="md">
            Rebane&apos;s Discord{" "}
            <Text component="span" c="#5865F2" inherit>
              Colored
            </Text>{" "}
            Text Generator
          </Title>

          <Paper bg="#36393F" p="md" mb="lg">
            <Title order={3} ta="center" mb="sm">
              About
            </Title>
            <Text ta="center" size="sm">
              This is a simple app that creates colored Discord messages using
              the ANSI color codes available on the latest Discord desktop
              versions.
            </Text>
            <Text ta="center" size="sm" mt="xs">
              To use this, write your text, select parts of it and assign colors
              to them, then copy it using the button below, and send in a
              Discord message.
            </Text>
          </Paper>

          <Paper bg="#36393F" p="md" mb="lg">
            <Title order={3} ta="center" mb="sm">
              Source Code
            </Title>
            <Text ta="center" size="sm">
              This app runs entirely in your browser and the source code is
              freely available on{" "}
              <Text
                component="a"
                href="https://gist.github.com/rebane2001/07f2d8e80df053c70a1576d27eabe97c"
                c="#00AFF4"
              >
                GitHub
              </Text>
              . Shout out to kkrypt0nn for{" "}
              <Text
                component="a"
                href="https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06"
                c="#00AFF4"
              >
                this guide
              </Text>
              .
            </Text>
          </Paper>

          <Title order={2} ta="center" mb="md">
            Create your text
          </Title>

          <Text ta="center" size="sm" mb="md" c="dimmed">
            Select text in the box below and click any color button to apply the
            color to your selection
          </Text>

          <Group justify="center" mb="md">
            {styleButtons.map((btn) => (
              <Button
                key={btn.ansi}
                className={btn.className}
                onClick={() => applyStyle(btn.ansi)}
                variant="filled"
                bg="#4f545c"
                styles={{
                  root: {
                    fontWeight: btn.ansi === "1" ? 700 : undefined,
                    textDecoration: btn.ansi === "4" ? "underline" : undefined,
                  },
                }}
              >
                {btn.label}
              </Button>
            ))}
          </Group>

          <Flex align="center" justify="center" mb="md" gap="md">
            <Text fw={700}>FG</Text>
            <Group>
              {fgColors.map((color) => (
                <Tooltip key={color.ansi} label={color.tooltip} position="top">
                  <Button
                    p={0}
                    w={32}
                    h={32}
                    bg={color.color}
                    onClick={() => applyStyle(color.ansi)}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              ))}
            </Group>
          </Flex>

          <Flex align="center" justify="center" mb="md" gap="md">
            <Text fw={700}>BG</Text>
            <Group>
              {bgColors.map((color) => (
                <Tooltip key={color.ansi} label={color.tooltip} position="top">
                  <Button
                    p={0}
                    w={32}
                    h={32}
                    bg={color.color}
                    onClick={() => applyStyle(color.ansi)}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              ))}
            </Group>
          </Flex>

          <Flex justify="center" mb="md">
            <Box
              ref={textareaRef}
              contentEditable
              w={600}
              h={200}
              bg="#2F3136"
              c="#B9BBBE"
              p="md"
              style={{
                borderRadius: "5px",
                resize: "both",
                overflow: "auto",
                textAlign: "left",
                fontFamily: "monospace",
                border: "#202225 1px solid",
                whiteSpace: "pre-wrap",
                fontSize: "0.875rem",
                lineHeight: "1.125rem",
                outline: "none",
                transition: "border-color 0.2s ease",
                ":focus": {
                  borderColor: "#5865F2",
                  boxShadow: "0 0 0 2px rgba(88, 101, 242, 0.2)",
                },
              }}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#5865F2";
                e.currentTarget.style.boxShadow =
                  "0 0 0 2px rgba(88, 101, 242, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#202225";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </Flex>

          <Group justify="center" mb="md">
            <Button
              onClick={handleCopy}
              style={{ backgroundColor: copyButtonColor }}
            >
              {copyButtonText}
            </Button>
          </Group>

          <Text ta="center" size="xs" c="dimmed" mb="md">
            This is an unofficial tool, it is not made or endorsed by Discord.
          </Text>
        </Container>
      </Box>
    </MantineProvider>
  );
}
