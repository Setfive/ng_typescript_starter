import * as angular from "angular";
import * as ui from "angular-ui-router";
import * as _ from "lodash"

export default function() {

    angular
        .module("DashboardModule", ['ui.router'])
        .config(function DashboadModuleConfig($stateProvider: ng.ui.IStateProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    resolve: {
                        fetchedData: function ($http: ng.IHttpService, $q : ng.IQService) {
                            const df = $q.defer();
                            $http
                                .get("https://jsonplaceholder.typicode.com/photos")
                                .then(result => df.resolve(result.data));
                            return df.promise;
                        }
                    },
                    views: {
                        main: {component: 'dashboardComponent'},
                        sidebar: {component: 'sidebarComponent'}
                    }
                })


        })
        .component('dashboardComponent', new DashboardComponent())
        .component('sidebarComponent', new SidebarComponent())
        .component('imageComponent', new ImageComponent())
        .service('PhotoApi', PhotoService);
    ;

}

interface IPhotoUpdate {
    (image: IPhoto) : void;
}

class PhotoService {
    private selectedPhotos : IPhoto[];
    private notifyOnUpdate : IPhotoUpdate[];

    constructor(){
        this.selectedPhotos = [];
        this.notifyOnUpdate = [];
    }

    public getSelectedPhotos() {
        return this.selectedPhotos;
    }

    public selectImage(image: IPhoto){
        this.selectedPhotos.push(image);
    }

    public remove(image: IPhoto) : IPhoto[] {
        this.selectedPhotos = _.reject(this.selectedPhotos, (f) => f == image);
        this.notifyOnUpdate.forEach(f => f.apply(null, [image]));
        return this.selectedPhotos;
    }

    public registerOnUpdate(fn: IPhotoUpdate) : void{
        this.notifyOnUpdate.push(fn);
    }

}

class SidebarComponent implements ng.IComponentOptions {
    public transclude: boolean = true;
    public templateUrl: string = "sidebar.tpl";
    public controller: any = SidebarComponentController;
    public bindings: any = {

    };
}

class SidebarComponentController {
    static $inject = ["PhotoApi"];
    private PhotoApi : PhotoService;
    private selectedPhotos : IPhoto[];

    constructor(PhotoApi: PhotoService){
        this.PhotoApi = PhotoApi;
    }

    public $onInit() {
        this.selectedPhotos = this.PhotoApi.getSelectedPhotos();
    }

    public remove(image: IPhoto) {
        this.selectedPhotos = this.PhotoApi.remove(image);
    }
}

class DashboardComponent implements ng.IComponentOptions {
    public transclude: boolean = true;
    public templateUrl: string = "dashboardModule.tpl";
    public controller: any = DashboardComponentController;
    public bindings: any = {
        "fetchedData": "<",
    };
}

interface IPhoto {
    id : number;
    albumId : number;
    title : string;
    url : string;
    thumbnailUrl : string;
    selected : boolean;
}

class DashboardComponentController {
    static $inject = ["$http", "PhotoApi"];
    private $http: ng.IHttpService;
    private PhotoApi : PhotoService;

    fetchedData: IPhoto[];
    chunkedData: IPhoto[][];

    constructor($http: ng.IHttpService, PhotoApi: PhotoService) {
        this.$http = $http;
        this.PhotoApi = PhotoApi;
    }

    public $onInit() {
        this.chunkedData = _(this.fetchedData).take(12).chunk(4).value();
    }

    public imageSelected(image : IPhoto) : void {
        this.PhotoApi.selectImage(image);
    }
}

interface IOnSelect {
    image: IPhoto;
}

interface IImageComponentController {
    onSelect(image: IOnSelect) : void;
}

class ImageComponentController implements IImageComponentController {

    static $inject = ["PhotoApi"];
    private PhotoApi : PhotoService;

    image : IPhoto;
    public onSelect:(image: IOnSelect) => void;

    constructor(PhotoApi: PhotoService) {
        this.PhotoApi = PhotoApi;
    }

    public onDeselect(image: IPhoto) : void {
        if(image == this.image){
            this.image.selected = false;
        }
    }

    public $onInit() : void {
        this.PhotoApi.registerOnUpdate(this.onDeselect.bind(this));
    }

    public onClick() : void {

        if(this.image.selected){
            return;
        }

        this.image.selected = true;
        this.onSelect({image: this.image});
    }
}

class ImageComponent implements ng.IComponentOptions {
    public transclude: boolean = true;
    public templateUrl: string = "image.tpl";
    public controller: any = ImageComponentController;
    public bindings: any = {
        "image": "<",
        "onSelect": "&"
    };
}