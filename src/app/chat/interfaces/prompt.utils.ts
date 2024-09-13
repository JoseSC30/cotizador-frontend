export const FORMAT_JSON = `Por favor, devuelve la información únicamente en el siguiente formato JSON y sin texto adicional:
{
  "detalles_proyecto": [
    {
      "nombre": "Dormitorio Matrimonial",
      "dimensiones": {
        "ancho": 4,
        "largo": 4,
        "alto": 4
      }
    },
    {
      "nombre": "Dormitorio Individual",
      "dimensiones": {
        "ancho": 3,
        "largo": 3,
        "alto": 4
      }
    },
    {
      "nombre": "Cocina en Isla",
      "dimensiones": {
        "ancho": 3,
        "largo": 3,
        "alto": 4
      }
    }
  ],
  "materiales_construccion": [
    {"nombre": "Ladrillo Cerámico de 6H tabique", "cantidad": 100, "precio_unitario": 1.20, "total": 120.00},
    {"nombre": "Baldosas Cerámicas", "cantidad": 40, "precio_unitario": 35.00, "total": 1400.00},
    {"nombre": "Cemento", "cantidad": 50, "precio_unitario": 50.00, "total": 2500.00}
  ],
  "instalaciones": [
    {"nombre": "Tubería de PVC de 1/2 pulg", "cantidad": 20, "precio_unitario": 4.00, "total": 80.00},
    {"nombre": "Cable eléctrico", "cantidad": 100, "precio_unitario": 2.00, "total": 200.00}
  ],
  "mano_de_obra_requerida": [
    {"nombre": "Maestro Albañil", "dias": 10, "precio_dia": 150.00, "total": 1500.00},
    {"nombre": "Ayudante", "dias": 15, "precio_dia": 100.00, "total": 1500.00},
    {"nombre": "Plomero", "dias": 5, "precio_dia": 100.00, "total": 500.00},
    {"nombre": "Electricista", "dias": 3, "precio_dia": 100.00, "total": 300.00}
  ],
  "costos_estimados": {
    "materiales": 4200.00,
    "mano_de_obra": 3800.00,
    "instalaciones": 280.00
  },
  "total_final": 8280.00,
  "nota": "Este es un presupuesto estimado y podría variar dependiendo de factores adicionales como transporte de materiales, imprevistos en la construcción, etc. Se recomienda un 10% de contingencia sobre el presupuesto total."
}`;
