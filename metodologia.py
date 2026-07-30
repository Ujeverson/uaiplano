import json
from pathlib import Path
from docling.document_converter import DocumentConverter

BASE_DIR = Path(__file__).resolve().parent
pdf_path = BASE_DIR / "documentos" / "metodologia-senai.pdf"
json_path = BASE_DIR / "metodologia-senai.json"

if not pdf_path.exists():
    print(f"[ERRO] Arquivo não encontrado: {pdf_path}")
    exit(1)

print("Iniciando conversão...")
result = DocumentConverter().convert(str(pdf_path))
json_path.write_text(json.dumps(result.document.export_to_dict(), ensure_ascii=False, indent=2), encoding="utf-8")

print(f"[SUCESSO] JSON gerado em: {json_path}")
