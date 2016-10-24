<div class="col-md-4">
    <h3>Selected photos:</h3>
    <ul class="sidebar">
        <li ng-repeat="photo in $ctrl.selectedPhotos">
            <span ng-bind="photo.thumbnailUrl"></span>
            - <a class="btn btn-xs btn-danger" href="" ng-click="$ctrl.remove(photo)">Remove</a>
        </li>
    </ul>
</div>