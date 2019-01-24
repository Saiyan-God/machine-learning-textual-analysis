import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Datasets',
    icon: 'nb-home',
    link: '/pages/datasets',
  },
  {
    title: 'View Trained Models',
    icon: 'nb-list',
    link: '/pages/view-models'
  }, 
  {
    title: 'Train New Models',
    icon: 'nb-home',
    link: '/pages/model-trainer',
  }, 
  {
    title: 'Predict',
    icon: 'nb-bar-chart',
    link: '/pages/predict',
  }
];
