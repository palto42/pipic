from django.conf.urls import patterns, url

from djpilapp import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url('^jstest/$', views.jstest, name='jstest'),
    url('^shoot/(\d+)/(\d+)/$', views.shoot, name='shoot'),
    url('^jsonupdate/$', views.jsonupdate, name='jsonupdate'),
    url('^findinitialparams/$', views.findinitialparams, name='findinitialparams'),
)
