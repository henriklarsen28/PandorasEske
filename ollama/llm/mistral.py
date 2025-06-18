from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

device = torch.device("mps") if torch.backends.mps.is_available() else torch.device("cpu")

model_id = "norallm/normistral-7b-warm-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map='auto',
    torch_dtype=torch.bfloat16
)
def prompt_mistral(message: str):

    

    
    inputs = tokenizer(message, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=20)


    
    output_tokens = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(output_tokens)
    return output_tokens