import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
  NavigationEnd, ActivatedRoute
} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  currentPageTitle = signal('Tableau de Bord');
  isPublicPage = signal(false);
  protected readonly title = signal('events');

  protected readonly menu = [
    { label: 'Accueils', path: '/' },
    { label: 'Tickets', path: '/tickets' },
    { label: 'Achat Ticket', path: '/tickets/achat' },
    { label: 'Evenements', path: '/evenements' },
    { label: 'Utilisateurs', path: '/utilisateurs' },
    { label: 'Artistes', path: '/artistes' },
    { label: 'Organisateurs', path: '/organisateurs' },
    { label: 'Administrateurs', path: '/administrateurs' },
    { label: 'Type Évènements', path: '/type-evenements' },
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isPublicPage.set(url.includes('/tickets/achat'));

      // On va chercher le titre au bout de la chaîne de routage
      let route = this.activatedRoute.root;
      while (route.firstChild) {
        route = route.firstChild;
      }

      // Si un titre est défini sur la route, on l'applique au signal
      if (route.snapshot.title) {
        this.currentPageTitle.set(route.snapshot.title);
      }
    });

  }
}
