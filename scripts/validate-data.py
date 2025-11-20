#!/usr/bin/env python3
"""
Script para validar e cruzar dados do banco com planilhas de próximos eventos
"""

import json
import pandas as pd
from datetime import datetime
import re
from collections import defaultdict

def parse_valor(valor_str):
    """Converte string de valor para centavos"""
    if not valor_str or pd.isna(valor_str):
        return 0
    # Remove R$, espaços e converte vírgula para ponto
    valor_clean = str(valor_str).replace('R$', '').replace(' ', '').replace('.', '').replace(',', '.')
    try:
        return int(float(valor_clean) * 100)
    except:
        return 0

def parse_convidados(conv_str):
    """Extrai número total de convidados"""
    if not conv_str or pd.isna(conv_str):
        return 0
    conv_str = str(conv_str)
    # Formato: "50+10" ou "100"
    match = re.search(r'(\d+)\+?(\d+)?', conv_str)
    if match:
        base = int(match.group(1))
        extra = int(match.group(2)) if match.group(2) else 0
        return base + extra
    return 0

def parse_date(date_str):
    """Converte string de data para objeto datetime"""
    if not date_str or pd.isna(date_str):
        return None
    try:
        # Formato DD/MM/YYYY
        return datetime.strptime(str(date_str), '%d/%m/%Y')
    except:
        return None

def normalize_name(name):
    """Normaliza nome para comparação"""
    if not name or pd.isna(name):
        return ""
    return str(name).strip().lower()

print("🔍 Iniciando validação cruzada de dados...\n")

# Ler JSON de contratos futuros
with open('/home/ubuntu/upload/contratos_futuros.json', 'r', encoding='utf-8') as f:
    contratos_json = json.load(f)

# Ler planilha de próximos eventos
df_proximos = pd.read_excel('/home/ubuntu/upload/Proximos-eventos.xlsx')

# Ler planilha de próximas festas (antiga)
df_antigas = pd.read_excel('/home/ubuntu/upload/Próximasfestas.xlsx')

print(f"📊 Dados carregados:")
print(f"  - JSON de contratos: {len(contratos_json)} registros")
print(f"  - Planilha Proximos-eventos: {len(df_proximos)} registros")
print(f"  - Planilha Próximasfestas: {len(df_antigas)} registros\n")

# Processar JSON
festas_json = {}
for contrato in contratos_json:
    nome = normalize_name(contrato.get('nome_contratante', ''))
    data = parse_date(contrato.get('data_evento', ''))
    if nome and data:
        key = f"{nome}_{data.strftime('%Y%m%d')}"
        if key not in festas_json:
            festas_json[key] = {
                'nome': contrato.get('nome_contratante', ''),
                'data': data,
                'valor': parse_valor(contrato.get('valor_festa', '')),
                'convidados': parse_convidados(contrato.get('numero_convidados', '')),
                'tema': contrato.get('tema_festa', ''),
                'aniversariante': contrato.get('nome_aniversariante', ''),
                'fonte': 'JSON'
            }

# Processar planilha Proximos-eventos
festas_planilha = {}
for _, row in df_proximos.iterrows():
    nome = normalize_name(row.get('Nome do Contratante', ''))
    data = parse_date(row.get('Data do Evento', ''))
    if nome and data:
        key = f"{nome}_{data.strftime('%Y%m%d')}"
        if key not in festas_planilha:
            festas_planilha[key] = {
                'nome': row.get('Nome do Contratante', ''),
                'data': data,
                'valor': parse_valor(row.get('Valor da Festa', '')),
                'convidados': parse_convidados(row.get('Número de Convidados', '')),
                'tema': row.get('Tema da Festa', ''),
                'aniversariante': row.get('Nome do Aniversariante', ''),
                'fonte': 'Planilha'
            }

# Processar planilha antiga
festas_antigas = {}
for _, row in df_antigas.iterrows():
    nome = normalize_name(row.get('Nome do cliente', ''))
    data = parse_date(row.get('Data da  Festa', ''))
    if nome and data:
        key = f"{nome}_{data.strftime('%Y%m%d')}"
        if key not in festas_antigas:
            festas_antigas[key] = {
                'nome': row.get('Nome do cliente', ''),
                'data': data,
                'valor': parse_valor(row.get('Valor ', '')),
                'convidados': parse_convidados(row.get('N° de convidados', '')),
                'fonte': 'Planilha Antiga'
            }

print(f"📋 Festas únicas identificadas:")
print(f"  - JSON: {len(festas_json)} festas")
print(f"  - Planilha Proximos-eventos: {len(festas_planilha)} festas")
print(f"  - Planilha Próximasfestas: {len(festas_antigas)} festas\n")

# Unificar todas as festas
todas_festas = {}
for key, festa in festas_json.items():
    todas_festas[key] = festa

for key, festa in festas_planilha.items():
    if key not in todas_festas:
        todas_festas[key] = festa
    else:
        # Atualizar com dados da planilha se mais completos
        if not todas_festas[key]['valor'] and festa['valor']:
            todas_festas[key]['valor'] = festa['valor']
        if not todas_festas[key]['tema'] and festa['tema']:
            todas_festas[key]['tema'] = festa['tema']

for key, festa in festas_antigas.items():
    if key not in todas_festas:
        todas_festas[key] = festa

print(f"✅ Total de festas únicas consolidadas: {len(todas_festas)}\n")

# Agrupar por mês
por_mes = defaultdict(list)
for key, festa in todas_festas.items():
    mes_ano = festa['data'].strftime('%m/%Y')
    por_mes[mes_ano].append(festa)

print("📅 Distribuição por mês:")
for mes_ano in sorted(por_mes.keys()):
    festas_mes = por_mes[mes_ano]
    valor_total = sum(f['valor'] for f in festas_mes)
    print(f"  {mes_ano}: {len(festas_mes)} festas - R$ {valor_total/100:,.2f}")

# Salvar lista consolidada
festas_para_importar = []
for key, festa in todas_festas.items():
    festas_para_importar.append({
        'nome_cliente': festa['nome'],
        'data_evento': festa['data'].strftime('%d/%m/%Y'),
        'valor_total': festa['valor'],
        'numero_convidados': festa['convidados'],
        'tema': festa['tema'],
        'aniversariante': festa.get('aniversariante', ''),
        'fonte': festa['fonte']
    })

# Ordenar por data
festas_para_importar.sort(key=lambda x: datetime.strptime(x['data_evento'], '%d/%m/%Y'))

# Limpar valores NaN antes de salvar
import math
for festa in festas_para_importar:
    for key, value in festa.items():
        if isinstance(value, float) and math.isnan(value):
            festa[key] = None
        elif value == '' or (isinstance(value, str) and value.strip() == ''):
            festa[key] = None

# Salvar em JSON
output_file = '/home/ubuntu/festeja-kids-2/scripts/festas_consolidadas.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(festas_para_importar, f, ensure_ascii=False, indent=2)

print(f"\n✅ Dados consolidados salvos em: {output_file}")
print(f"📊 Total de festas para validação: {len(festas_para_importar)}")

# Estatísticas
print("\n📈 Estatísticas:")
valor_total = sum(f['valor_total'] for f in festas_para_importar)
print(f"  Valor total: R$ {valor_total/100:,.2f}")
print(f"  Ticket médio: R$ {(valor_total/len(festas_para_importar))/100:,.2f}")
print(f"  Total de convidados: {sum(f['numero_convidados'] for f in festas_para_importar)}")
