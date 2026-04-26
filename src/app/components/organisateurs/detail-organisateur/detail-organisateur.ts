import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrganisateurApiService } from '../../../services/organisateur-api.service';
import { Organisateur } from '../../../models/organisateur';

@Component({
  selector: 'app-detail-organisateur',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink],
  templateUrl: './detail-organisateur.html',
  styleUrl: './detail-organisateur.css'
})
export class DetailOrganisateur implements OnInit {
  organisateur: Organisateur | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private organisateurService: OrganisateurApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.organisateurService.getOrganisateurById(id).subscribe({
      next: (data) => {
        this.organisateur = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(date: any): string {
    if (!date) return '-';
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour ?? 0).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`;
    }
    try {
      const d = new Date(date);
      return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return date;
    }
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
  }

  onBack(): void {
    this.router.navigate(['/organisateurs']);
  }
}
