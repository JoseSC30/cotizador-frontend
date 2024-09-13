import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { AdvisorService } from '../../services/advisor.service';
import { Subscription, tap } from 'rxjs';
import { AlertsService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  imgPerfil: string = 'assets/images/img-user.png';
  iconSearch: string = 'assets/icons/ic-save.png';
  iconEdit: string = 'assets/icons/ic-edit-user.png';
  iconDelete: string = 'assets/icons/ic-delete-user.png';
  iconArrowLeft: string = 'assets/icons/ic-arrow-left.png';
  iconArrowRight: string = 'assets/icons/ic-arrow-right.png';

  modalSwitchCreate: boolean = false;
  modalSwitchEdit: boolean = false;

  advisor: any;
  //allAdvisors:any;
  allAdvisors: any[] = [];
  filteredAdvisors: any[] = [];
  searchAdvisor: string = '';
  userNotFound: boolean = false;
  suscription: Subscription = new Subscription();

  currentPage: number = 1;
  rows: number = 5;
  totalPages: number = 0;
  visiblePages: number[] = [];
  pageWindowSize: number = 5;

  constructor(
    private modalService: ModalService,
    private advisorService: AdvisorService,
    private alertService: AlertsService
  ) {}

  ngOnInit(): void {
    this.modalService.$modal.subscribe((value) => {
      this.modalSwitchCreate = value;
    });
    this.modalService.$modalEdit.subscribe((value) => {
      this.modalSwitchEdit = value;
    });
    this.getAllAdvisors();
    this.suscription = this.advisorService.tableAdvisors$.subscribe(() => {
      this.getAllAdvisors();
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  openModalAdvisor(id?: any, name?: any, lastname?: any, email?: any) {
    //modal edit
    if (id != null) {
      this.modalSwitchEdit = true;
      console.log(this.modalSwitchEdit);

      this.advisor = {
        id: id,
        name: name,
        lastname: lastname,
        email: email,
      };
      this.modalService.sendData(this.advisor);
    } else {
      //modal create
      this.modalSwitchCreate = true;
    }
  }

  getAllAdvisors() {
    this.advisorService.getAllAdvisors().subscribe(
      (res) => {
        this.allAdvisors = res;
        console.log(res);

        this.filteredAdvisors = this.allAdvisors;
        this.totalPages = Math.floor(this.filteredAdvisors.length / this.rows);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  filterAdvisors() {
    this.filteredAdvisors = this.allAdvisors.filter(
      (advisor) =>
        advisor.name.toLowerCase().includes(this.searchAdvisor.toLowerCase()) ||
        advisor.lastName
          .toLowerCase()
          .includes(this.searchAdvisor.toLowerCase())
    );
    this.userNotFound = this.filteredAdvisors.length === 0;
  }

  deleteAdvisor(advisorId: any) {
    this.alertService.showConfirmationDialog().then((confirmed) => {
      if (confirmed) {
        this.advisorService
          .deleteAdvisor(advisorId)
          .pipe(
            tap(() => {
              console.log(`asesor con id ${advisorId} eliminado`);
            })
          )
          .subscribe(
            () => {
              this.alertService.toast(
                'Asesor eliminado correctamente',
                'success'
              );
            },
            (error) => {
              console.error('Error al eliminar el Asesor:', error);
              this.alertService.toast('El Asesor no se pudo eliminar', 'error');
            }
          );
      }
    });
  }

  //pagination

  DisplayList(page: number) {
    const start = this.rows * (page - 1);
    const end = start + this.rows;
    return this.filteredAdvisors.slice(start, end);
  }

  setPagination() {
    const pageCount = Math.ceil(this.allAdvisors.length / this.rows);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.DisplayList(this.currentPage);
    }
  }

  onNextPage() {
    if (this.currentPage < this.allAdvisors.length) {
      this.currentPage++;
      this.DisplayList(this.currentPage);
    }
  }

  isLastPageSelected(): boolean {
    return this.currentPage === this.totalPages + 1;
  }
}
