import { Component, OnInit } from '@angular/core';
import { UPost } from '../shared/UPost.model';
import { CrudService } from '../shared/crud.service';
import { catchError } from 'rxjs/operators';
import { ACrudService } from '../../Authentication/shared/acrud.service';
import { ToastrService } from 'ngx-toastr';
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers
})
export class HomeComponent implements OnInit {

  peliculas:any[]=[
    {name:'Frozen 2',
    img:'assets/imagenesprofe/fotoejemplo1.png',
    desc:'Elsa, Anna, Kristoff and Olaf head far into the forest to learn the truth about an ancient mystery of their kingdom.'},
    {
      name:'The Irishman',
      img:'assets/imagenesprofe/fotoejemplo2.png',
      desc:'Pennsylvania, 1956. Frank Sheeran, a war veteran of Irish origin who works as a truck driver, accidentally meets mobster Russell Bufalino. Once Frank becomes his trusted man, Bufalino sends him to Chicago with the task of helping Jimmy Hoffa, a powerful union leader related to organized crime, with whom Frank will maintain a close friendship for nearly twenty years.'
    }
  ];

  data: UPost[];
  sorted: UPost[];
  featuredPost: any
  isFetching: boolean = false
  error: string
  searchText
  featuredPostsorted: any[];
  commenData: any = []
  constructor(private cd: CrudService,
    private acrud: ACrudService,
    private toastr: ToastrService,
    config: NgbCarouselConfig) {
      // customize default values of carousels used by this component tree
		config.interval = 5000;
		config.wrap = false;
		config.keyboard = false;
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
  }
  
  showNavigationIndicators = true;
  showNavigationArrows = true;
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

  ngOnInit(): void {
    this.getAllPost()
    this.getFeaturedPost()


  }

  getAllPost() {
    this.isFetching = true;
    this.acrud.getAllPost().then((x: any) => {
      this.isFetching = false
      this.data = x
      this.sortDesecending(this.data)

    })
  }
  sortDesecending(data) {
    this.sorted = data.sort((a: any, b: any) =>
      <any>new Date(b.created_date) - <any>new Date(a.created_date)
    )
  }
  onReadMore(index) {

  }

  getFeaturedPost() {
    this.acrud.getFeaturedPost().then(x => {
      let c = 0
      this.featuredPost = x
      for (let i in this.featuredPost) {
        let y = this.acrud.seprate(this.featuredPost[i].commentData)
        this.commenData.push(y)
      }

    },
      err => {
        console.log(err)
      })


  }

  public_data() {
    this.isFetching = true;
    this.cd.get_public_post()
      .subscribe(result => {
        this.data = result.map(e => {
          return {
            ...e.payload.doc.data() as {}
          } as UPost

        })
        this.isFetching = false;
      },
        err => {
          this.isFetching = false;
          this.error = err

        })
    catchError(error => {
      throw new Error('Error: Getting document:' + error); // throw an Error
    });

  }


}
