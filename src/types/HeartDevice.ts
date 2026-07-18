export type Hotspot = {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
};

export type HeartDevice = {
  id: string;
  name: string;
  description: string;
  clinicalPurpose: string;
  replaces: string;
  materials: string;
  advantages: string[];
  limitations: string[];
  procedure: string;
  lifespan: string;
  engineeringFacts: string[];
  typicalPatients: string;
  fdaApproval: string;
  image: string;
  modelType: 'mechanical' | 'bioprosthetic' | 'tavr' | 'stent' | 'ring' | 'future';
  hotspots: Hotspot[];
  comparison: {
    weight: string;
    material: string;
    lifespan: string;
    anticoagulants: string;
    patientAge: string;
    delivery: string;
    surgery: string;
    durability: string;
    cost: string;
  };
};
