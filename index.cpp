bool BST(Tree* root,int target){
    if(root == NULL) return false;
    if(root-> data == target) return true;
    if(root-> data > target){
        return BST(root->left,target);
    }
    return BST(root->right,target);
}