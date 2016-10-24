<div class="col-md-8">
    <h1 class="page-header">Available Images:</h1>
    <p>Fetching dummy photo data from <a target="_blank" href="https://jsonplaceholder.typicode.com">https://jsonplaceholder.typicode.com</a></p>
    <p>Click some photos to select.</p>

    <div class="row image-row" ng-repeat="list in $ctrl.chunkedData">
        <image-component ng-repeat="element in list" image="element" on-select="$ctrl.imageSelected(image)"></image-component>
    </div>

</div>