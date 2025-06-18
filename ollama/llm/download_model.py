from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "bineric/NorskGPT-Llama-13B-v0.1"
local_path = "./models/norsk-gpt-13b"

# Download & cache the model/tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Save to local path
tokenizer.save_pretrained(local_path)
model.save_pretrained(local_path)