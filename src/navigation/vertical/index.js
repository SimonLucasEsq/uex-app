export default [
  {
    title: 'Inicio',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Actividades',
    to: { name: 'activities' },
    icon: { icon: 'tabler-files' },
  },
  {
    title: 'Alumnos',
    to: { name: 'students' },
    icon: { icon: 'tabler-users' },
  },
  {
    title: 'Docentes',
    to: { name: 'professors' },
    icon: { icon: 'tabler-school' },
  },
  {
    title: 'Organizaciones',
    to: { name: 'organizations' },
    icon: { icon: 'tabler-building' },
  },
  {
    title: 'Reportes',
    icon: { icon: 'tabler-file-analytics' },
  },
  {
    title: 'Configuraciones',
    icon: { icon: 'tabler-settings' },
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
