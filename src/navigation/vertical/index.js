export default [
  {
    title: 'Actividades',
    to: { name: 'activities' },
    icon: { icon: 'tabler-files' },
    "aria-label": "Actividades",
  },
  {
    title: 'Alumnos',
    to: { name: 'students' },
    icon: { icon: 'tabler-users' },
    "aria-label": "Actividades",
  },
  {
    title: 'Docentes',
    to: { name: 'professors' },
    icon: { icon: 'tabler-school' },
    "aria-label": "Actividades",
  },
  {
    title: 'Organizaciones',
    to: { name: 'organizations' },
    icon: { icon: 'tabler-building' },
    "aria-label": "Actividades",
  },
  {
    title: 'Configuraciones',
    icon: { icon: 'tabler-settings' },
    "aria-label": "Actividades",
    children: [
      {
        title: 'Carreras',
        to: { name: 'careers' },
        icon: { icon: 'tabler-point' },
      },
      {
        title: 'Tipos de Actividades',
        to: { name: 'activity-types' },
        icon: { icon: 'tabler-point' },
      },
    ],
  },

]
