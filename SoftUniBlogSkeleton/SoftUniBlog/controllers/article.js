const Article = require('mongoose').model('Article');
module.exports = {
    createGet: (req,res) => {
        res.render('article/create');
    },
    createPost:(req,res) =>
    {
        let articleArgs =  req.body;
        let errormsg = '';
        if (!req.isAuthenticated())
        {
            errormsg = 'You should be logged!';
        }
        else if(!articleArgs.title)
        {
            errormsg = 'Error: No title given';
        }
        else if(!articleArgs.content)
        {
            errormsg = 'Error: No story shared';
        }
        if(errormsg)
        {
            res.render ('article/create', {error:errormsg});
            return;
        }
        articleArgs.author =req.user.id;
        Article.create(articleArgs).then(article =>
        {
            req.user.articles.push(article.id);
            req.user.save(err=>
            {
                if(err)
                {
                    res.redirect('/',{error:err.message});
                }
                else
                {
                    res.redirect('/');
                }
            })
        });
    },
    details:(req,res)=>
    {
        let id=req.params.id;
        Article.findById(id).populate('author').then(article =>
        {
            res.render('article/details',article)
        });
    }
}