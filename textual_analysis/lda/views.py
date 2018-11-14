from django.shortcuts import render

def home(request):
    context = {
        'test_variable': "LDA"
    }
    return render(request, 'lda/home.html', context)

def about(request):
    return render(request, 'lda/about.html')