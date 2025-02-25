# Sentient AI
This project explores the possibility of achieving consciousness through a fundamental brain simulation that integrates large language models (LLMs). The goal is to investigate whether replicating certain aspects of brain activity, alongside the use of LLMs, can lead to the emergence of conscious experience.

## Required: 
- [Node.js](https://nodejs.org/en/download)
- [Sox](https://sourceforge.net/projects/sox/files/sox/14.4.1/) (14.4.1 suggested)
- [LM Studio](https://lmstudio.ai/ "LM Studio") with an AI model. I suggest DeepSeek R1.

## How to Install?
run:
```bash
lms server start
```

```bash
npm run sentient
```

## Layers Explained

### Deep Thinking Layer
Deep Thinking Layer consists of an infinite loop. It's job is to do the repetitive background tasks like taking emotions, vital values, visual/auditory informations and all other data it can take and then makes a request to the LLM to create a context to be used by other layers later.

### Thought Layer Layer
Thought Layer is the API that allows other layers to generate thoughts. Thought layer takes emotions, vitals, context and other values to answer to the prompt it has given from the LLM.

### Memories Layer
Memories Layer is where all the memories are handled. It consists of two parts. Long-term memory and short-term memory. When an event happens in other layers (eg. someone says something and system hears this, a conversation happens, system takes action, system says something etc.) this layer is informed. Then LLM runs with the action, current emotions and vital values. LLM determines if this action is worth for the long-term memory or not.

- Short-term memory is cheap, and lasts for a minute (a little longer than a human's, as the system is not as fast as a human). Entries older than a minute is removed from the memory.
- Long-term memory is expensive. Memories in this layer has 3 levels of importance (1: not very important - 3: very important). If a memory is not accessed frequently it loses importance level and if level reaches 0 it is removed from long-term memory.

### Reflexes and Automatic Behaivours Layer


### Emotions Layer
Emotions Layer stores and manages hormones. Also by looking at the hormonal values determines current closest emotions and provides other layers with that data.

### Senses Layer

### Motor FunctionsLayer

### Conscious Layer (Decision Making Layer)

